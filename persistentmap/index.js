const {promises: fs} = require('fs');
const path = require('path');

const CLEAR = Symbol('clear file');

/**
 * An ES6 Map, lazily persisted to an append-only transaction file, so it's
 * state can be restored, even if the process terminates unexpectedly.
 *
 * Write actions (set, delete, clear) are applied
 * immediately, but are saved async.  Caller's wishing to insure a write action
 * is persisted should await the action before continuing.
 *
 * The transaction file format is a newline-separated list of JSON arrays
 * describing actions to apply to the map.  Each action is a 1 or 2 element
 * array as follows:
 *
 *   ["key"] = Delete "key" from map
 *   ["key", {JSON value}] = Set "key" to value
 *
 * File size is capped at [approximately] `options.maxFileSize.  If the
 * transaction file exceeds this size at the time of a write action, a new file
 * is started with the current map state .  I.e. write actions are generally
 * very fast (on the order of 100K's/second or even 1M's/second) but may
 * occasionally take as long as needed to write the full state of the map.
 */
module.exports = class PersistentMap extends Map {
  _nBytes = 0;

  /**
   * @param {String} name
   * @param {Object} [options]
   * @param {Number} [options.maxFileSize = 1e6] Max size of transaction file (bytes)
   */
  constructor(filepath, options) {
    super();

    // Validate / normalize path
    filepath = path.resolve(filepath);

    this.options = Object.assign({maxFileSize: 1e6}, options);
    this.filepath = filepath;
  }

  /**
   * Apply a write action to the map
   * @param {String|CLEAR} key to set.  If CLEAR, clears the map
   * @param {*} val to set
   */
  _exec(key, val) {
    if (key === CLEAR) {
      // Clear map
      super.clear();
    } else if (val !== undefined) {
      // Set a value
      super.set(key, val);
    } else {
      // Delete key
      super.delete(key);
    }
  }

  /**
   * Write action queue to disk.
   */
  async _write() {
    if (this._writing) return;

    // Loop because items may get pushed onto queue while we're writing
    while (this._queue) {
      let q = this._queue;
      const {resolve, reject} = q;
      delete this._queue;
      this._writing = true;
      try {
        // Slice to most recent CLEAR action
        const clearIndex = q.reduce ((a, b, i) => b[0] === CLEAR ? i : a, -1);
        if (clearIndex >= 0) q = q.slice(clearIndex + 1);

        // Compose JSON to write
        const json = q.map(action => JSON.stringify(action)).join('\n');

        if (clearIndex >= 0) {
          // If CLEAR, start with new file
          this._nBytes = 0;
          if (!json) {
            await fs.unlink(this.filepath);
          } else {
            const tmpFile = `${this.filepath}.tmp`;
            await fs.writeFile(tmpFile, json + '\n');
            await fs.rename(tmpFile, this.filepath);
          }
        } else if (json) {
          await fs.appendFile(this.filepath, json + '\n');
        }

        this._nBytes += json.length;
        resolve();
      } catch (err) {
        if (err.code == 'ENOENT') {
          // unlinking non-existent file is okay
          resolve(err);
        } else {
          reject(err);
        }
      } finally {
        this._writing = false;
      }
    }
  }

  /**
   * Push action onto the write queue
   */
  _push(...action) {
    // If empty action, just return queue promise
    if (action.length == 0) {
      return this._queue ? this._queue.promise : undefined;
    }

    // Auto-compact
    const {maxFileSize} = this.options;
    if (maxFileSize != null && this._nBytes >= maxFileSize) {
      this._nBytes = 0;
      return this.compact();
    }

    // Create queue & promise if needed
    if (!this._queue) {
      const q = this._queue = [];
      q.promise = new Promise((res, rej) => {
        q.resolve = res;
        q.reject = rej;
      });
    }

    const [key, val] = action;

    // Null key clears the map
    if (key === CLEAR) {
      this._queue.length = 0;
      this._queue.push([CLEAR]); // Clear

      // Special case - compact() passes current entries in val
      if (val && val[Symbol.iterator]) this._queue.push(...val);
    } else {
      this._queue.push(action);
    }

    // Grab promise here in case _write() clears the queue
    const writePromise = this._queue.promise;

    // Make sure write loop runs
    this._write();

    // Return promise that resolves once action has been written
    return writePromise;
  }

  /**
   * Load map from transaction file.  This also compacts the file before resolving.
   */
  async load() {
    // Read file, separate into action array
    let lines;
    try {
      const json = await fs.readFile(this.filepath, 'utf8');
      this._nBytes = json.length;
      lines = json.split('\n');
    } catch (err) {
      if (err.code != 'ENOENT') throw err;
      lines = [];
    }

    // Apply each action
    super.clear();
    lines.forEach((line, i) => {
      line = line.trim();
      if (!line) return;
      let action;
      try {
        action = JSON.parse(line);
      } catch (err) {
        console.warn(`PersistentMap load() error @ line ${i + 1}: ${err.message}`, line);
        return;
      }

      this._exec(...action);
    });

    return this;
  }

  /**
   * Clears transaction file and initializes it with the current map state
   */
  compact() {
    return this._push(CLEAR, this.entries());
  }

  /**
   * @returns {Promise} Resolves once all queued actions have been saved
   */
  flush() {
    return this._push();
  }

  //
  // Map mutation methods (override to add persistence)
  //

  clear() {
    this._exec(CLEAR);
    return this._push(CLEAR);
  }

  delete(k) {
    this._exec(k);
    // If empty, we clear (delete) the file
    return this._push(this.size == 0 ? CLEAR : k);
  }

  set(key, val) {
    this._exec(key, val);
    return this._push(key, val);
  }
};

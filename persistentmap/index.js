const {promises: fs} = require('fs');
const path = require('path');

/**
 * An ES6 Map, lazily persisted to an append-only save-file, so it's state can
 * be restored, even if the process terminates unexpectedly.
 *
 * Write actions (set, delete, clear) are applied
 * immediately, but are saved async.  Caller's wishing to insure a write action
 * is persisted should await the action before continuing.
 *
 * The save-file format is a newline-separated list of JSON objects describing
 * actions to apply to the map.  Each action is a 1 or 2 element array as
 * follows:
 *
 *   [null] = Clear map
 *   [null, {Object values}] = clear map and set all values
 *   ["key"] = Delete "key" from map
 *   ["key", {JSON value}] = Set "key" to value
 *
 * File size is capped at [approximately] `options.maxFileSize.  If the save-file
 * exceeds this size at the time of a write action, the file is reset and the
 * action is converted to a full-state snapshot.  I.e. write actions are
 * generally very fast (on the order of 100K's/second or even 1M's/second) but
 * may occasionally take as long as needed to write the full state of the map.
 */
module.exports = class PersistentMap extends Map {
  /**
   * @param {String} name
   * @param {Object} [options]
   * @param {Number} [options.maxFileSize = 1e6] Max size of save-file (bytes)
   */
  constructor(filepath, options) {
    super();

    // Validate / normalize path
    filepath = path.resolve(filepath);

    this.options = Object.assign({maxFileSize: 1e6}, options);
    this.nBytes = 0;
    this.filepath = filepath;
  }

  /**
   * Apply a write action to the map
   * @param {String|null} key to set.  If null, updates whole map
   * @param {*} val to set
   */
  _exec(key, val) {
    if (key === null) {
      // Full snapshot - replace map with val
      super.clear();
      for (const args of Object.entries(val)) super.set(...args);
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
      const q = this._queue;
      delete this._queue;

      this._writing = true;
      try {
        // Reset save-file if first item is a full snapshot
        const isReset = q[0] && (q[0][0] == null);

        // Compose JSON to write
        const json = q.map(q => JSON.stringify(q)).join('\n') + '\n';

        if (isReset) {
          this.nBytes = 0;
          const tmpFile = `${this.filepath}.tmp`;
          await fs.writeFile(tmpFile, json);
          await fs.rename(tmpFile, this.filepath);
        } else {
          await fs.appendFile(this.filepath, json);
        }

        this.nBytes += json.length;
        q._resolve();
      } catch (err) {
        q._reject(err);
      } finally {
        this._writing = false;
      }
    }
  }

  /**
   * Push action onto the write queue
   */
  _push(...action) {
    const {maxFileSize} = this.options;
    if (maxFileSize != null && this.nBytes >= maxFileSize) {
      this.nBytes = 0;
      action = [null];
    }

    // Snapshots reset the queue
    if (action[0] == null && this._queue) this._queue.length = 0;

    if (!this._queue) {
      // Create queue (and promise to resolve once the queue has been written)
      const q = this._queue = [];
      q._promise = new Promise((res, rej) => {
        q._resolve = res;
        q._reject = rej;
      });
    }

    const writePromise = this._queue._promise;

    // "Flush" actions (action.length == 0) are no-ops.  They just provide a way
    // to access the current queue promise, and can otherwise be ignored.
    if (action.length) this._queue.push(action);

    // Make sure write loop runs
    this._write();

    // Return promise that resolves once action has been written
    return writePromise;
  }

  /**
   * Load map from save-file.  This also compacts the file before resolving.
   */
  async load() {
    // Read file, separate into action array
    let lines;
    try {
      const json = await fs.readFile(this.filepath, 'utf8');
      this.nBytes = json.length;
      lines = json.split('\n');
    } catch (err) {
      if (err.code != 'ENOENT') throw err;
      lines = [];
    }

    // Apply each action
    super.clear();
    lines.forEach((line, i) => {
      if (!line) return;
      try {
        this._exec(...JSON.parse(line));
      } catch (err) {
        // Warn on action parse error, but continue on since there's not
        // much to be done about thisk
        console.warn(`PersistentMap load() error @ line ${i + 1}: ${err.message}`, line);
      }
    });

    // Compact file
    await this._push(null, Object.fromEntries(this.entries()));

    return this;
  }

  /**
   * (async) Resolve once all queued actions have been saved
   */
  flush() {
    return this._push();
  }

  //
  // Map mutation methods (override to add persistence)
  //

  clear() {
    super.clear();
    return this._push(null);
  }

  set(key, val) {
    if (key == null) throw Error('Key cannot be null');
    this._exec(key, val);
    return this._push(key, val);
  }

  delete(k) {
    this._exec(k);
    return this._push(k);
  }
};

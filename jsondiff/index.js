// Reserved values
const DROP = '\uE796-';  // Delete value
const KEEP = '\uE796+';  // Keep value

/**
 * Normalize a patch value by converting DROP values to undefined.  This is
 * useful for doing code such as `if (jsondiff.value(patch.someValue)) ...`
 *
 * @param {any} value
 */
function value(val) {
  return val === DROP ? undefined : val;
}

/**
 * Generate a patch object that describes the difference between two states
 *
 * @param {any} before
 * @param {any} after
 *
 * @returns {any} Patch object as described in the README
 */
function diff(before, after) {
  if (after === undefined) return DROP;
  if (after == null) return null;
  if (before == null) return after;

  // Different types
  if (before.constructor.name !== after.constructor.name) return after;

  let type = after.constructor.name;
  switch (type) {
    case 'Boolean':
      return after;

    case 'Number':
    case 'String':
      return before === after ? KEEP : after;

    case 'Date': // Not strictly JSON but useful
      return before.getTime() === after.getTime() ? KEEP : after;

    case 'Object': {
      let isEqual = true;
      const values = {};
      for (const k of new Set([...Object.keys(before), ...Object.keys(after)])) {
        const val = diff(before[k], after[k]);
        if (val !== KEEP) {
          values[k] = val;
          isEqual = false;
        }
      }

      return isEqual ? KEEP : values;
    }

    case 'Array': {
      let isEqual = before.length === after.length;
      const values = new Array(after.length);
      for (let i = 0, l = values.length; i < l; i++) {
        values[i] = diff(before[i], after[i]);
        if (values[i] !== KEEP) isEqual = false;
      }

      return isEqual ? KEEP : values;
    }

    default:
      throw Error(`Unexpected type: ${type}`);
  }
};

/**
 * Apply a patch object to some 'before' state and return the 'after' state
 *
 * @param {any} before
 * @param {any} _patch
 *
 * @returns {any} The mutated state
 */
function patch(before, _patch) {
  if (_patch === DROP) return undefined;
  if (_patch === KEEP) _patch = before;
  if (_patch == null) return _patch;

  if (before === _patch) return before;

  const beforeType = before == null ? 'null' : before.constructor.name;
  const type = _patch.constructor.name;

  if (beforeType !== type) {
    switch (type) {
      case 'Object': before = {}; break;
      case 'Array': before = []; break;
      default: return _patch;
    }
  }

  switch (type) {
    case 'Boolean':
    case 'Number':
    case 'String':
    case 'Symbol':
      break;
    case 'Date': // Not strictly JSON but useful
      if (before.getTime() == _patch.getTime()) _patch = before;
      break;

    case 'Object': {
      let isEqual = true;
      const values = {...before};
      for (const k in _patch) {
        if (value(_patch[k]) === undefined) {
          if (k in values) {
            delete values[k];
            isEqual = false;
          }
        } else {
          const val = patch(before[k], _patch[k]);
          if (val !== before[k]) {
            values[k] = val;
            isEqual = false;
          }
        }
      }

      _patch = isEqual ? before : values;
      break;
    }

    case 'Array': {
      const values = new Array(_patch.length);
      let isEqual = before.length === _patch.length;
      for (let i = 0, l = _patch.length; i < l; i++) {
        const val = patch(before[i], _patch[i]);

        if (val !== before[i]) isEqual = false;
        values[i] = val;
      }
      _patch = isEqual ? before : values;
      break;
    }

    default:
      throw Error(`Unexpected type: ${type}`);
  }
  return before === _patch ? before : _patch;
};

module.exports = {
  DROP,
  KEEP,
  diff,
  patch,
  value,
  merge(before, after) {return patch(before, diff(before, after));}
};

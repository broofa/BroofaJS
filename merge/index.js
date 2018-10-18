/**
 * @param {primitive} before
 * @param {primitive} after
 */
function merge(before, after) {
  // Same object
  if (before === after) return before;

  // Undefined or null
  if (before == null || after == null) return after;

  // Different types
  if (before.constructor !== after.constructor) return after;

  let type = before.constructor.name;
  switch (type) {
    case 'Boolean':
    case 'Number':
    case 'String':
    case 'Symbol':
      return before === after ? before : after;

    case 'Date': // Not strictly JSON but useful
      return before.getTime() === after.getTime() ? before : after;

    case 'Object': {
      let isEqual = true;
      const merged = {};
      for (const k of new Set([...Object.keys(before), ...Object.keys(after)])) {
        const val = merge(before[k], after[k]);
        isEqual = isEqual && val === before[k];
        if (val !== undefined) merged[k] = val;
      }
      return isEqual ? before : merged;
    }

    case 'Array': {
      let isEqual = before.length === after.length;
      const merged = new Array(Math.max(before.length, after.length));
      for (let k = 0, l = merged.length; k < l; k++) {
        const val = merge(before[k], after[k]);
        isEqual = isEqual && val === before[k];
        if (val !== undefined) merged[k] = val;
      }
      return isEqual ? before : merged;
    }

    default:
      throw Error(`Unexpected type: ${aType.name}`);
  }
}

module.exports = merge;

function merge(a, b) {
  // Identical?
  if (a === b) return a;

  // Undefined or null?
  if (a == null || b == null) return b;

  // Different types?
  if (a.constructor !== b.constructor) return b;

  let type = typeof(a);
  if (a.getTime) type = 'date' // Not JSON, but useful
  if (Array.isArray(a)) type = 'array';

  switch (type) {
      // '===' comparable tyeps
    case 'boolean':
    case 'number':
    case 'string': // Not strictly JSON but useful
      return a === b ? a : b;

    case 'date':
      return a.getTime() === b.getTime() ? a : b;

    case 'object': {
      let isEqual = true;
      const merged = {};
      for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
        const val = merge(a[k], b[k]);
        isEqual = isEqual && val === a[k];
        if (val !== undefined) merged[k] = val;
      }
      return isEqual ? a : merged;
    }

    case 'array': {
      let isEqual = a.length === b.length;
      const merged = new Array(Math.max(a.length, b.length));
      for (let k = 0, l = merged.length; k < l; k++) {
        const val = merge(a[k], b[k]);
        isEqual = isEqual && val === a[k];
        if (val !== undefined) merged[k] = val;
      }
      return isEqual ? a : merged;
    }

    default:
      throw Error(`Unexpected type: ${aType.name}`);
  }
}

module.exports = merge;

// Reserved values
const DROP = '\uE796-';  // Delete value
const KEEP = '\uE796+';  // Keep value

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

function _patch(before, _diff, isMask = false) {
  if (_diff === DROP) return undefined;
  if (_diff === KEEP) _diff = before;
  if (_diff == null) return _diff;

  if (before === _diff) return before;

  const beforeType = before == null ? 'null' : before.constructor.name;
  const type = _diff.constructor.name;

  if (beforeType !== type) {
    switch (type) {
      case 'Object': before = {}; break;
      case 'Array': before = []; break;
      default: return _diff;
    }
  }

  switch (type) {
    case 'Boolean':
    case 'Number':
    case 'String':
    case 'Symbol':
      break;
    case 'Date': // Not strictly JSON but useful
      if (before.getTime() == _diff.getTime()) _diff = before;
      break;

    case 'Object': {
      let isEqual = true;
      const values = isMask ? {} : {...before};
      for (const k in _diff) {
        if (_diff[k] === DROP && k in values) {
          delete values[k];
          isEqual = false;
        } else {
          values[k] = _patch(before[k], _diff[k], isMask);
          if (values[k] !== before[k]) isEqual = false;
        }
      }

      _diff = isEqual ? before : values;
      break;
    }

    case 'Array': {
      const values = new Array(_diff.length);
      let isEqual = before.length === _diff.length;
      for (let i = 0, l = _diff.length; i < l; i++) {
        const val = _patch(before[i], _diff[i], isMask);

        if (val !== before[i]) isEqual = false;
        values[i] = val;
      }
      _diff = isEqual ? before : values;
      break;
    }

    default:
      throw Error(`Unexpected type: ${type}`);
  }
  return before === _diff ? before : _diff;
};

module.exports = {
  DROP,
  KEEP,
  diff,
  patch(before, _diff) {return _patch(before, _diff);},
  mask(before, _diff) {return _patch(before, _diff, true);},
  merge(before, after) {return _patch(before, diff(before, after));}
};

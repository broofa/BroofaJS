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
      const _ = {};
      for (const k of new Set([...Object.keys(before), ...Object.keys(after)])) {
        const val = diff(before[k], after[k]);
        if (val !== KEEP) {
          _[k] = val;
          isEqual = false;
        }
      }

      return isEqual ? KEEP : _;
    }

    case 'Array': {
      let isEqual = before.length === after.length;
      const _ = new Array(after.length);
      for (let i = 0, l = _.length; i < l; i++) {
        _[i] = diff(before[i], after[i]);
        if (_[i] !== KEEP) isEqual = false;
      }

      return isEqual ? KEEP : _;
    }

    default:
      throw Error(`Unexpected type: ${type}`);
  }
};

function patch(before, _diff) {
  if (_diff === DROP) return undefined;
  if (before === _diff || _diff === KEEP) return before;
  if (before == null || _diff == null) return _diff;

  const type = before.constructor.name;

  // Different types
  if (type !== _diff.constructor.name) return _diff;

  // Pick before v. diff value
  switch (type) {
    case 'Boolean':
    case 'Number':
    case 'String':
    case 'Symbol':
      return before === _diff ? before : _diff;

    case 'Date': // Not strictly JSON but useful
      return before.getTime() === _diff.getTime() ? before : _diff;

    case 'Object': {
      let isEqual = true;
      const _ = {...before};
      for (const k in _diff) {
        const val = patch(before[k], _diff[k]);
        isEqual = isEqual && val === before[k];
        if (val === undefined || val === DROP) {
          delete _[k];
        } else {
          _[k] = val;
        }
      }
      return isEqual ? before : _;
    }

    case 'Array': {
      let _ = new Array(_diff.length);
      let isEqual = before.length === _diff.length;
      for (let i = 0, l = _diff.length; i < l; i++) {
        const val = patch(before[i], _diff[i]);
        if (val === before[i] || val === KEEP) {
          _[i] = before[i];
        } else {
          isEqual = false;
          _[i] = val === DROP ? undefined : val;
        }
      }

      return isEqual ? before : _;
    }

    default:
      throw Error(`Unexpected type: ${type}`);
  }
};

module.exports = {
  DROP,
  KEEP,
  diff,
  patch,
  merge(before, after) {
    return patch(before, diff(before, after));
  }
};

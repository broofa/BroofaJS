module.exports = function(strings, ...exps) {
  const result = [];
  const {isArray} = Array;

  // Convert quantity expressions to [quantity, quantity string] tuples
  exps.forEach((v, i) => {
    if (typeof(v) == 'number') {
      exps[i] = [v, v];
    } else if (isArray(v)) {
      if (typeof(v[0]) == 'number') {
        exps[i] = [v[0], typeof v[1] == 'function' ? v[1](v[0]) : null];
      } else {
        // Edge case where the caller injects an Array but doesn't intend for it
        // to be treated as a quantity.  Not worth solving at present.
        throw TypeError('First item in array must be a Number');
      }
    }
  });

  // Initialize the quantity to use for pluralization
  let qty = exps.find(isArray);
  let last;

  for (let s of strings) {
    // Trim leading whitespace hidden quantities
    if (isArray(last) && last[1] == null) {
      s = s.replace(/^\s+/, '');
    }

    // Push current string, pluralizing if we have a valid quantity
    if (qty) {
      result.push(s.replace(/\[([^|]*)\|([^\]]*)\]/g, qty[0] == 1 ? '$1' : '$2'));
    } else {
      result.push(s);
    }

    if (!exps.length) break;

    // Locate next quantity
    qty = exps.find(isArray) || qty;

    // Push quantity string
    last = exps.shift();
    result.push(last === qty ? qty[1] : last);
  }

  return result.join('');
};

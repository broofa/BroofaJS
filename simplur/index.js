/**
 * String template tag function for conditional pluralization.
 * Substitutes strings of the form "[singular|plural]" based on
 * the value of the preceeding numeric expression.
 */
module.exports = function(strings, ...exps) {
  const result = [];
  let n = exps[0];
  let label = n;
  if (Array.isArray(n)) {
    label = typeof n[1] == 'function' ? n[1](n[0]) : null;
    n = n[0];
  }

  for (const s of strings) {
    if (typeof(n) == 'number') {
      result.push(s.replace(/\[([^|]*)\|([^\]]*)\]/g, n == 1 ? '$1' : '$2'));
    } else {
      result.push(s);
    }

    if (!exps.length) break;
    n = label = exps.shift();
    if (Array.isArray(n)) {
      label = typeof n[1] == 'function' ? n[1](n[0]) : null;
      n = n[0];
    }
    result.push(label);
  }

  return result.join('');
};

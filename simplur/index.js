/**
 * String template tag function for conditional pluralization.
 * Substitutes strings of the form "[singular|plural]" based on
 * the value of the preceeding numeric expression.
 */
module.exports = function(strings, ...exps) {
  const result = [];
  let n = exps[0];
  for (const s of strings) {
    if (typeof(n) == 'number') {
      result.push(s.replace(/\[([^|]*)\|([^\]]*)\]/g, n == 1 ? '$1' : '$2'));
    } else {
      result.push(s);
    }

    if (!exps.length) break;
    n = exps.shift();
    result.push(n);
  }

  return result.join('');
}

module.exports = function(_target, options) {
  options = {methodRegex: /Async$/, ...options};

  const memo = new Map();

  return new Proxy(_target, {
    get: function(target, k) {
      // Non-string properties (i.e. Symbols) pass thru
      if (typeof(k) != 'string') return target[k];

      // If property isn't in the memo cache ...
      if (!memo.has(k)) {
        // Extract base method name
        const method = k.replace(options.methodRegex, '');

        // If it's different (i.e. matches regex), then promisify
        if (k !== method && typeof(target[method]) == 'function') {
          const promisified = function(...args) {
            return new Promise(function(resolve, reject) {
              target[method](...args, function(err, ...results) {
                if (err) {
                  reject(err);
                } else {
                  resolve(results.length <= 1 ? results[0] : results);
                }
              });
            });
          };

          memo.set(k, promisified);
        } else {
          memo.set(k, null);
        }
      }

      return memo.get(k) || target[k];
    }
  });
};

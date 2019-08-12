/**
 * A lite, fast, and robust String hash implementation, modeled after webcrypto
 * hash api.  This is based on https://github.com/sindresorhus/fnv1a, but
 * features a few important improvements.
 */

function digest() {
  let _ = 0x811c9dc5;

  const fnv = {
    update(...args) {
      for (let str of args) {
        let unicoded = false;
        for (let i = 0; i < str.length; i++) {
          let v = str.charCodeAt(i);

          // Handle unicode chars (v > 0x7f) on-demand
          if (v > 0x7f && !unicoded) {
            str = unescape(encodeURIComponent(str));
            unicoded = true;
            v = str.charCodeAt(i);
          }

          _ ^= v;
          _ += (_ << 1) + (_ << 4) + (_ << 7) + (_ << 8) + (_ << 24);
        }
      }

      return this;
    },

    get hash() {
      return _ >>> 0;
    }
  };

  return fnv;
}

function hash(...args) {
  return digest().update(...args).hash;
}

hash.digest = digest;

module.exports = hash;

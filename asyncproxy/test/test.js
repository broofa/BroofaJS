var assert = require('assert');
var asyncProxy = require('..');

const api = {
  foo: 'foo',

  passthru(...args) {
    const cb = args.pop();
    cb(null, ...args);
  },

  diethru(...args) {
    const cb = args.pop();
    cb(Error('I slip thus mortal coil'));
  }
};

describe(__filename, () => {
  it('wraps API', () => {
    const papi = asyncProxy(api);
    assert.deepStrictEqual(papi, api);
  });

  it('basic promise', async () => {
    const papi = asyncProxy(api);
    assert.equal(1, await papi.passthruAsync(1));
  });

  it('throws', async () => {
    const papi = asyncProxy(api);
    try {
      await papi.diethruAsync();
    } catch (err) {
      return;
    }

    throw Error('Failed to throw');
  });

  it('custom regex', async () => {
    const papi = asyncProxy(api, {methodRegex: /^a_/});
    assert.deepStrictEqual(1, await papi.a_passthru(1));
  });

  it('multi-args', async () => {
    const papi = asyncProxy(api);
    assert.deepStrictEqual([1, 2], await papi.passthruAsync(1,2));
  });
});

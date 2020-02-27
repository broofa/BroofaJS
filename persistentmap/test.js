const assert = require('assert');
const {promises: fs} = require('fs');
const PersistentMap = require('./index.js');

const FILE = '/tmp/test_map.json';

describe(__filename, () => {
  it('ES6 API', async () => {
    const pm = new PersistentMap(FILE);
    await pm.clear();
    await pm.set('x', 123);
    await pm.set('y', 456);

    assert(pm instanceof Map, 'is instance of Map');

    assert.equal(pm.size, 2);
    assert.equal(await pm.get('x'), 123);
    assert.equal(await pm.get('y'), 456);
    assert.deepEqual([...pm.keys()].sort(), ['x', 'y']);
    assert.deepEqual([...pm.values()].sort(), [123, 456]);
    assert.deepEqual([...pm.entries()].sort(), [['x', 123], ['y', 456]]);
    assert.deepEqual([...pm].sort(), [['x', 123], ['y', 456]]); // Iterable (same as entries())
  });

  it('clear', async () => {
    const pm = new PersistentMap(FILE);

    await pm.clear();
    await pm.set('x', 123);
    assert.equal(await pm.get('x'), 123);

    await pm.clear();
    assert.equal(pm.size, 0);

    try {
      // File should not exist
      await fs.stat(pm.getPath());
      assert.rejects('failed to throw');
    } catch (err) {}
  });

  it('loads', async () => {
    let pm = new PersistentMap(FILE);
    await pm.clear();
    await pm.set('x', 123);
    await pm.set('y', 456);
    assert.equal(await pm.get('x'), 123);

    pm = new PersistentMap(FILE);
    await pm.load();

    // Clear cache
    assert.deepEqual(Object.fromEntries(pm.entries()), {x: 123, y: 456});
  });

  it('perf', async () => {
    const pm = new PersistentMap(FILE, {maxFileSize: 100e3});
    await pm.clear();

    await new Promise(resolve => {
      const start = Date.now();
      let n = 0;
      function writeSome() {
        for (let i = 0; i < 100; i++, n++) {
          const k = n & 0xff;
          pm.set(String(k), n);
        }

        // Generate
        if (Date.now() - start < 1000) {
          setImmediate(writeSome, 0);
        } else {
          console.log(`${(1e3 * n / (Date.now() - start)).toFixed(0)} writes / second`);
          resolve();
        }
      }
      writeSome();
    });

    await pm.flush();
  });
});

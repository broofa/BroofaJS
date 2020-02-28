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
    assert.equal(pm.get('x'), 123);
    assert.equal(pm.get('y'), 456);
    assert.deepEqual([...pm.keys()].sort(), ['x', 'y']);
    assert.deepEqual([...pm.values()].sort(), [123, 456]);
    assert.deepEqual([...pm.entries()].sort(), [['x', 123], ['y', 456]]);
    assert.deepEqual([...pm].sort(), [['x', 123], ['y', 456]]); // Iterable (same as entries())
  });

  it('clear()', async () => {
    const pm = new PersistentMap(FILE);

    await pm.clear();
    await pm.set('x', 123);
    assert.equal(await pm.get('x'), 123);

    await pm.clear();
    assert.equal(pm.size, 0);

    try {
      // File should not exist
      await fs.stat(pm.getPath());
      assert.rejects('failed to throw', ' fafdaa');
    } catch (err) {}
  });

  it('load() & compact()', async() => {
    // Size here chosen to trigger a compact a few actions the end of our
    // for-loop, below, so if the compact-load logic it will result in an
    // incomplete restore of the state (and trigger an error)
    const pm = new PersistentMap(FILE, {maxFileSize: 43000});

    // Delete transaction file
    try {
      await fs.unlink(pm.filepath);
    } catch (err) {}

    // Write enough state to trigger a compact()
    let val = '';
    for (let i = 0; i < 1000; i++) {
      const key = `key_${i % 100}`;
      val += String.fromCharCode(32 + (i % 60));
      val = val.replace(/.* /, '');
      pm.set(key, val);
    }

    // Wait for it to write to file
    await pm.flush();

    // Snapshot what the map has
    const obj = Object.fromEntries(pm.entries());

    // Create and load another map
    const pm2 = new PersistentMap(FILE);
    await pm2.load();

    // Verify states are the same
    assert.deepEqual(
      Object.fromEntries(pm.entries()),
      Object.fromEntries(pm2.entries())
    );

    /*
    await pm.compact();
    const json = await fs.readFile(pm.filepath);

    assert.deepEqual(JSON.parse(json),[null, {x: 123, y: 456, foo: 'abc', bar: 'def'}]);
    */
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

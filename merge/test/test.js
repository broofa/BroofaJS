var assert = require('assert');
var merge = require('..');

describe(__filename, async () => {
  it('Undefined', async () => {
    assert.equal(123, merge(undefined, 123));
    assert.equal(undefined, merge(123, undefined));
  });

  it('Null', async () => {
    assert.equal(123, merge(null, 123));
    assert.equal(null, merge(123, null));
  });

  it('Boolean', async () => {
    assert.equal(true, merge(true, true));
    assert.equal(false, merge(true, false));
  });

  it('Number', async () => {
    assert.equal(111, merge(111, 111));
    assert.equal(222, merge(111, 222));
  });

  it('String', async () => {
    assert.equal('aaa', merge('aaa', 'aaa'));
    assert.equal('bbb', merge('aaa', 'bbb'));
  });

  it('Date', async () => {
    const a = new Date(100), b = new Date(100), c = new Date(200);
    assert.equal(a, merge(a, b));
    assert.equal(c, merge(a, c));
  });

  it('Array', async () => {
    const a = [1, 'abc', [1,2]];
    const b = [1, 'abc', [1,2]];
    const c = [1, 'abc', true];

    assert.equal(a, merge(a, b));
    assert.notEqual(c, merge(a, c)); // Has entries from both, so is new array
    assert.deepEqual(c, merge(a, c));
  });

  it('Object', async () => {
    const a = {bar: 222, a: 'aaa'};
    const b = {bar: 222, a: 'aaa'};
    const c = {bar: 222, a: 'bbb'};

    assert.equal(a, merge(a, b));
    assert.notEqual(c, merge(a, c)); // Has entries from both, so is new object
    assert.deepEqual(c, merge(a, c));
  });

  it('Compound', async () => {
    const a = {bar: 111, a: {x: 111}, b: [1, {x:222}, {x: 222}]};
    const b = {bar: 222, b: [4, {x:333}, {x: 222}],};

    assert.equal(a.b[2], merge(a, b).b[2]);
    assert.deepEqual(b, merge(a, b));
  });
});

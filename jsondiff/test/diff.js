var assert = require('assert');
var {diff, DROP, KEEP} = require('..');

describe(__filename, async () => {
  it('Undefined', async () => {
    assert.equal(123, diff(undefined, 123));
    assert.equal(DROP, diff(123, undefined));
  });

  it('Null', async () => {
    assert.equal(KEEP, diff(null, null));
    assert.equal(123, diff(null, 123));
    assert.equal(null, diff(123, null));
  });

  it('Boolean', async () => {
    assert.equal(true, diff(true, true));
    assert.equal(false, diff(true, false));
  });

  it('Number', async () => {
    assert.equal(KEEP, diff(111, 111));
    assert.equal(222, diff(111, 222));
  });

  it('String', async () => {
    assert.equal(KEEP, diff('aaa', 'aaa'));
    assert.equal('bbb', diff('aaa', 'bbb'));
  });

  it('Date', async () => {
    const a = new Date(100), b = new Date(100), c = new Date(200);
    assert.equal(KEEP, diff(a, b));
    assert.equal(c, diff(a, c));
  });

  it('Array', async () => {
    const a = [1, 'abc', [1,2]];
    const b = [1, 'abc', [1,2]];
    const c = [1, 'abc', true];

    assert.equal(KEEP, diff(a, b));
    assert.deepEqual([KEEP, KEEP, true], diff(a, c));
    assert.deepEqual([KEEP], diff(a, [1]));
    assert.deepEqual([KEEP, KEEP, 3, 4, 5], diff(a, [1,'abc',3,4,5]));
  });

  it('Object', async () => {
    const a = {bar: 222, a: 'aaa'};
    const b = {bar: 222, a: 'aaa'};
    const c = {bar: 222, a: 'bbb'};

    assert.equal(KEEP, diff(a, b));
    assert.deepEqual({a: 'bbb'}, diff(a, c));
  });

  it('Compound', async () => {
    const a = {bar: 111, a: {x: 111}, b: [1, {x:222}, {x: 222}]};
    const b = {bar: 222, b: [4, {x:333}, {x: 222}],};

    assert.deepEqual({bar: 222, a: DROP, b: [4, {x:333}, KEEP]}, diff(a, b));
  });
});

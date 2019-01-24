var assert = require('assert');
var {diff, patch} = require('..');

describe(__filename, async () => {
  it('Undefined', async () => {
    assert.equal(123, patch(undefined, 123));
    assert.equal(undefined, patch(123, undefined));
  });

  it('Null', async () => {
    assert.equal(123, patch(null, 123));
    assert.equal(null, patch(123, null));
  });

  it('Boolean', async () => {
    assert.equal(true, patch(true, true));
    assert.equal(false, patch(true, false));
  });

  it('Number', async () => {
    assert.equal(111, patch(111, 111));
    assert.equal(222, patch(111, 222));
  });

  it('String', async () => {
    assert.equal('aaa', patch('aaa', 'aaa'));
    assert.equal('bbb', patch('aaa', 'bbb'));
  });

  it('Date', async () => {
    const a = new Date(100), b = new Date(100), c = new Date(200);
    assert.equal(a, patch(a, b));
    assert.equal(c, patch(a, c));
  });

  it('Array', async () => {
    const a = [1, 'abc', [1,2]];
    const b = [1, 'abc', [1,2]];
    const c = [1, 'abc', true];

    assert.equal(a, patch(a, b));
    //assert.equal(c, patch(a, c));
  });

  it('Object', async () => {
    const a = {bar: 222, a: 'aaa'};
    const b = {bar: 222, a: 'aaa'};
    const c = {bar: 222, a: 'bbb'};

    assert.equal(a, patch(a, b));
    assert.notEqual(c, patch(a, c)); // Has entries from both, so is new object
    assert.deepEqual(c, patch(a, c));
  });

  it('Compound', async () => {
    const a = {bar: 111, a: {x: 111}, b: [1, {x:222}, {x: 222}]};
    const b = {bar: 222, b: [4, {x:333}, {x: 222}],};

    assert.deepEqual(
      patch(a, b),
      {bar: 222, a: {x: 111}, b: [4, {x:333}, {x: 222}]}
    );
  });

  it('diff-patch', async () => {
    const a = {
      bar: 111,
      a: {x: 111},
      b: [1, {x:222}, {x: 222}],
      c: 333,
      f: [1,2,5,6],
      ff: [1,2,6],
    };
    const b = {
      bar: 222,
      b: [4, {x:333}, {x: 222}],
      d: 444,
      f: [1,2,6],
      ff: [1,2,5,6],
    };

    const d = JSON.parse(JSON.stringify(diff(a, b)));
    assert.deepEqual(patch(a, diff(a, b)), b);
  });
});

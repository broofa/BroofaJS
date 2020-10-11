const assert = require('assert');
const simplur = require('..');

describe('simplur', () => {
  it('ignores tokens when no numeric quantity is in scope', () => {
    assert.equal(simplur`hello world`, 'hello world');
    assert.equal(simplur`[hello|world]`, '[hello|world]');
    assert.equal(simplur`${'hello'} [hello|world]`, 'hello [hello|world]');
  });

  it('properly pluralizes', () => {
    assert.equal(simplur`${0} t[ooth|eeth]`, '0 teeth');
    assert.equal(simplur`${1} t[ooth|eeth]`, '1 tooth');
    assert.equal(simplur`${2} t[ooth|eeth]`, '2 teeth');
  });

  it('uses leading quantity', () => {
    assert.equal(simplur`${2} t[ooth|eeth]`, '2 teeth');
  });

  it('uses trailing quantity', () => {
    assert.equal(simplur`t[ooth|eeth] ${2}`, 'teeth 2');
  });

  it('prefers leading quantity', () => {
    assert.equal(simplur`${2} t[ooth|eeth] ${3}`, '2 teeth 3');
  });

  it('finds numeric quantities', () => {
    assert.equal(simplur`${'baz'} ${1} [hello|world]`, 'baz 1 hello');
    assert.equal(simplur`${1} ${'baz'} [hello|world]`, '1 baz hello');
    assert.equal(simplur`${'baz'} [hello|world] ${1}`, 'baz hello 1');
    assert.equal(simplur`[hello|world] ${'baz'} ${1}`, 'hello baz 1');
  });

  it('supports custom quantity function', () => {
    function formatQuantity(val) {
      return val < 1 ? 'no' :
        val == 1 ? 'one' :
        val == 2 ? 'both' :
        val == 3 ? null :
        val;
    }

    assert.equal(simplur`${[0, formatQuantity]} t[ooth|eeth]`, 'no teeth');
    assert.equal(simplur`${[1, formatQuantity]} t[ooth|eeth]`, 'one tooth');
    assert.equal(simplur`${[2, formatQuantity]} t[ooth|eeth]`, 'both teeth');
    assert.equal(simplur`${[3, formatQuantity]} t[ooth|eeth]`, 'teeth');
    assert.equal(simplur`${[4, formatQuantity]} t[ooth|eeth]`, '4 teeth');

    assert.equal(simplur`${[0]} t[ooth|eeth]`, 'teeth');
  });

  it('allows one quantity, many tokens', () => {
    assert.equal(simplur`${1} There [is|are] m[an|en]`, '1 There is man');
    assert.equal(simplur`There [is|are] ${1} m[an|en]`, 'There is 1 man');
    assert.equal(simplur`There [is|are] m[an|en] ${1}`, 'There is man 1');
  });

  it('allows many quantities, many tokens', () => {
    assert.equal(simplur`${1} ca[lf|lves] and ${1} lea[f|ves]`, '1 calf and 1 leaf');
  });
});

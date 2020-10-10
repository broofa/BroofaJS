const assert = require('assert');
const simplur = require('..');

describe('simplur', () => {
  it('Simple case', () => {
    assert.equal(simplur`${1} t[ooth|eeth]`, '1 tooth');
    assert.equal(simplur`${2} t[ooth|eeth]`, '2 teeth');
  });

  it('Many values, Many substitutions', () => {
    assert.equal(simplur`${1} ca[lf|lves] and ${1} lea[f|ves]`, '1 calf and 1 leaf');
    assert.equal(simplur`${2} ca[lf|lves] and ${2} lea[f|ves]`, '2 calves and 2 leaves');
  });

  it('One value, many substitutions', () => {
    assert.equal(simplur`${1} m[an|en] and wom[an|en]`, '1 man and woman');
    assert.equal(simplur`${2} m[an|en] and wom[an|en]`, '2 men and women');
  });

  it('Leading substitution', () => {
    assert.equal(simplur`There [is|are] ${1} m[an|en]`, 'There is 1 man');
    assert.equal(simplur`There [is|are] ${2} m[an|en]`, 'There are 2 men');
  });

  it('Omit quantity', () => {
    assert.equal(simplur`${[1]}[This|These] [man|men]`, 'This man');
    assert.equal(simplur`${[2]}[This|These] [man|men]`, 'These men');
  });

  it('Custom units', () => {
    function units(val) {
      return val < 1 ? 'no' :
        val == 1 ? 'only' :
        val == 2 ? 'both' :
        val < 5 ? 'a few' :
        val;
    }
debugger;
    assert.equal(simplur`${[0, units]} t[ooth|eeth]`, 'no teeth');
    assert.equal(simplur`${[1, units]} t[ooth|eeth]`, 'only tooth');
    assert.equal(simplur`${[2, units]} t[ooth|eeth]`, 'both teeth');
    assert.equal(simplur`${[3, units]} t[ooth|eeth]`, 'a few teeth');
    assert.equal(simplur`${[4, units]} t[ooth|eeth]`, 'a few teeth');
    assert.equal(simplur`${[5, units]} t[ooth|eeth]`, '5 teeth');
  });
});

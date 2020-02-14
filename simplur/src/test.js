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

  it('Custom value', () => {
    debugger;
    assert.equal(simplur`${[0, 'no']} t[ooth|eeth]`, 'no teeth');
    assert.equal(simplur`${[1, 'only']} t[ooth|eeth]`, 'only tooth');
    assert.equal(simplur`${[26, 'all']} t[ooth|eeth]`, 'all teeth');
  });
});

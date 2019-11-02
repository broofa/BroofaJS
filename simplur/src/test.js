const assert = require('assert');
const sp = require('..');

describe('simplur', () => {
  it('Simple case', () => {
    assert.equal(sp`${1} t[ooth|eeth]`, '1 tooth');
    assert.equal(sp`${2} t[ooth|eeth]`, '2 teeth');
  });

  it('Many values, Many substitutions', () => {
    assert.equal(sp`${1} ca[lf|lves] and ${1} lea[f|ves]`, '1 calf and 1 leaf');
    assert.equal(sp`${2} ca[lf|lves] and ${2} lea[f|ves]`, '2 calves and 2 leaves');
  });

  it('One value, many substitutions', () => {
    assert.equal(sp`${1} m[an|en] and wom[an|en]`, '1 man and woman');
    assert.equal(sp`${2} m[an|en] and wom[an|en]`, '2 men and women');
  });

  it('Leading substitution', () => {
    assert.equal(sp`There [is|are] ${1} m[an|en]`, 'There is 1 man');
    assert.equal(sp`There [is|are] ${2} m[an|en]`, 'There are 2 men');
  });
});

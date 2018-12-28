const assert = require('assert');
const StringLang = require('.');

assert.deepEqual(
  new StringLang('Hello World or Καλημέρα κόσμε or こんにちは 世界').inspect(),
  {
    basicLatin: 21,
    cjkUnifiedIdeographs: 2,
    greekandCoptic: 13,
    hiragana: 5
  }
);

console.log('All tests passed');

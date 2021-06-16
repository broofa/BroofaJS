import assert from 'assert';
import fetch from 'node-fetch';
import {BLOCKS, unicodeBlock, unicodeBlockCount} from './index.js';

assert.deepEqual(
  unicodeBlockCount('Hello World or Καλημέρα κόσμε or こんにちは 世界'),
  {
    'Basic Latin': 21,
    'CJK Unified Ideographs': 2,
    'Greek and Coptic': 13,
    Hiragana: 5
  }
);

fetch('https://raw.githubusercontent.com/bits/UTF-8-Unicode-Test-Documents/master/UTF-8_sequence_unseparated/utf8_sequence_0-0x10ffff_assigned_printable_unseparated.txt')
  .then(res => res.text())
  .then(str => {
    console.log(`Counting ${str.length} chars`);
    console.time('Count time');
    const counts = unicodeBlockCount(str);
    console.timeEnd('Count time');

    console.log('All tests passed');
  })
 .catch(err => {
   console.error(err);
   process.exit(1);
 });

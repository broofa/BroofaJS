# stringlang

Data and utilities for identifying characters by unicode block

## Installation

```
npm i @broofa/stringlang
```

```javascript
import {unicodeBlock, unicodeBlockCount, BLOCKS} from 'stringlang';
```

## unicodeBlock()
Get block of a given character or code point.

Note: Runs at 10M+ chars/second on a modern Mac laptop ([test data](https://raw.githubusercontent.com/bits/UTF-8-Unicode-Test-Documents/master/UTF-8_sequence_unseparated/utf8_sequence_0-0x10ffff_assigned_printable_unseparated.txt))

```javascript
// Get block (codePoint)
unicodeBlock(30028); // => 'CJK Unified Ideographs'
```

```javascript
// Get block (string)
unicodeBlock('界'); // => 'CJK Unified Ideographs'
```

```javascript
// Get block (string, character index)
unicodeBlock('Aα界', 2); // => 'CJK Unified Ideographs'
```

## unicodeBlockCount()
Count characters by block

```javascript
unicodeBlockCount('Hello World or Καλημέρα κόσμε or こんにちは 世界'); // =>
// {
//   'Basic Latin': 21,
//   'CJK Unified Ideographs': 2,
//   'Greek and Coptic': 13,
//   Hiragana: 5
// }
```

## BLOCKS
Array of [block name, min code point, max code point] entries, ordered by code
point.
```javascript
BLOCKS; // =>
// [
//   [ 'Basic Latin', 0, 127 ],
//   [ 'Latin-1 Supplement', 128, 255 ],
//   ... 308 more entries
// ]
```

<!--
  -- This file is auto-generated from src/README_js.md. Changes should be made there.
  -->

# StringLang

Count characters by unicode block

## Installation

```
npm i @broofa/stringlang
```

## Example

```javascript
const StringLang = require('@broofa/stringlang');

const sl = new StringLang('Hello World or Καλημέρα κόσμε or こんにちは 世界');

// Use inspect() to see all block counts
sl.inspect(); // ⇨ { basicLatin: 21, cjkUnifiedIdeographs: 2, greekandCoptic: 13, hiragana: 5 }

// There is also a property for each block containing the character counts
const monkeys = new StringLang('🙈🙉🙊');
monkeys.emoticons; // ⇨ 3

```

----
Markdown generated from [src/README_js.md](src/README_js.md) by [![RunMD Logo](http://i.imgur.com/h0FVyzU.png)](https://github.com/broofa/runmd)
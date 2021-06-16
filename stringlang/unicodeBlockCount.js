import unicodeBlock from './unicodeBlock.js';

export default function(str) {
  const count = {};
  let i = 0, c;
  while ((c = str.codePointAt(i)) !== undefined) {
    // JS strings are UCS-16, so use 2 chars for codepoints >= 0x10000
    i += c < 0x10000 ? 1 : 2;
    try {
      const block = unicodeBlock(c);
      if (block !== undefined) count[block] = (count[block] ?? 0) + 1;
    } catch (err) {
      console.log(`Error for "${c}": ${err.message}`);
      process.exit();
    }
  }

  return count;
}

import BLOCKS from './data/blocks.js';

export default function(c, cp = 0) {
  if (typeof(c) === 'string') c = c.codePointAt(cp);
  // Binary search, optimized to test for basic-latin block in first step
  let hi = BLOCKS.length - 1, lo = -hi;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2)
    const [block, min, max] = BLOCKS[mid];
    if (c < min) {
      if (mid <= 0) return;
      hi = mid - 1;
    } else if (c > max) {
      lo = mid + 1;
    } else {
      return block;
    }
  }

  return;
}

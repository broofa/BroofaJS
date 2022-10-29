import BLOCKS from './data/blocks.js';

export default function(c, cp = 0) {
  if (typeof(c) === 'string') c = c.codePointAt(cp);
  // Binary search, optimized to test for basic-latin block in first step
  let hi = BLOCKS.length - 1, lo = -hi;
  while (lo < hi) {
    const mid = Math.trunc((lo + hi) / 2)
    const [block, min, max] = BLOCKS[Math.trunc(mid)];
    if (c > max) {
      lo = mid + 1;
    } else if (c < min) {
      hi = mid;
    } else {
      return block;
    }
  }

  return;
}

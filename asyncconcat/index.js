module.exports = function(stream, encoding) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('error', err => reject(err));
    stream.on('data', d => chunks.push(d));
    stream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      resolve(encoding ? buffer.toString(encoding) : buffer);
    });
  });
};

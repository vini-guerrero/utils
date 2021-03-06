const Long = require('long')

async function get64 (buffer, offset = 0) {
  return {
    value: Long.fromBytesLE(buffer.slice(offset)).toString(),
    length: 8
  }
}

module.exports = get64

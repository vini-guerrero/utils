const { DICTIONARY } = require('../../constants')

/**
 * Encode dictionnary
 * @param value
 * @returns {{value: Buffer, length: Number}}
 */
async function encode (value) {
  let len = 8

  for (let i in value) {
    if (value.hasOwnProperty(i)) {
      len += value[i].length
    }
  }

  let buf = Buffer.alloc(len)

  buf.writeUInt16LE(DICTIONARY, 0)
  buf.writeUInt32LE((value.length / 2) & 0x7FFFFFFF, 4)

  let bufPos = 8
  for (let i in value) {
    if (value.hasOwnProperty(i)) {
      value[i].copy(buf, bufPos)
      bufPos += value[i].length
    }
  }

  return buf
}

module.exports = {
  encode: (prepare, dictionary) => {
    return Object.keys(dictionary).reduce((promise, key) => {
      return promise.then(
        (rawData) => prepare(key)
          .then((rawKey) => prepare(dictionary[key])
            .then((rawValue) => {
              rawData.push(rawKey, rawValue)
              return rawData
            })
          )
      )
    }, Promise.resolve([])).then(encode)
  },
  type: (typeName, value) => typeName === 'object'
}

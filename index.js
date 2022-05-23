import converter from './converter/index.js'
import validator from './validator/index.js'

globalThis.hed = {
  converter,
  validator
}

export {
  converter,
  validator
}
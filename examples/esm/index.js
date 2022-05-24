import '../../dist/index.esm.js'
import * as demos from './demos.js'

export const tags = {
    valid: 'Event/Category/Experimental stimulus,Item/Object/Vehicle/Train,Attribute/Visual/Color/Purple',
    warning: 'Event/something',
    errors: {
      semantic: 'Item/Nonsense',
      syntactic: '/Action/Reach/To touch,((/Attribute/Object side/Left,/Participant/Effect/Body part/Arm),/Attribute/Location/Screen/Top/70 px'
    }
  }
  

const schema = await hed.validator.buildSchema({})
for (let name in demos) {
    await demos[name](hed, schema)
}

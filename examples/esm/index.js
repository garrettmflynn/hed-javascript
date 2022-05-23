import '../../dist/index.esm.js'
import * as demos from './demos.js'

for (let name in demos) {
    await demos[name](hed)
}

const hed = require('../../dist/index.node.cjs')
const demos = require('./demos.cjs')

hed.validator.buildSchema({}).then(schema => {

    const startDemos = async () => {
        for (let name in demos) {
            await demos[name](hed, schema)
        }
    }
    
    startDemos()

})


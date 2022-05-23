const hed = require('../../dist/index.node.cjs')
const demos = require('./demos.cjs')

const startDemos = async () => {
    for (let name in demos) {
        await demos[name](hed)
    }
}

startDemos()

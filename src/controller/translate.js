const { translate: translateLogic } = require('../logic/translate')

let translate = async (ctx) => {
    const { word, from, to } = ctx.request.body
    try {
        let result = await translateLogic(word, from, to)
        ctx.body = { result }
        ctx.status = 200
    } catch (e) {
        ctx.body = {
            error: e.toString()
        }
        ctx.status = 422
    }
}

module.exports = { translate }
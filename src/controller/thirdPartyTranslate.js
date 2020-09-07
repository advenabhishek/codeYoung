const { thirdPartyTranslate: thirdPartyTranslateLogic } = require('../logic/thirdPartyTranslate')

let thirdPartyTranslate = async (ctx) => {
    const { word, from, to } = ctx.request.body
    try {
        let result = await thirdPartyTranslateLogic(word, from, to)
        ctx.body = {result}
        ctx.status = 200
    } catch (e) {
        ctx.body = {
            error: e.toString()
        }
        ctx.status = 422
    }
}

module.exports = {thirdPartyTranslate}
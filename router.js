const Router = require('koa-router');
const router = new Router()

const { translate } = require('./src/controller/translate')
const { thirdPartyTranslate } = require('./src/controller/thirdPartyTranslate')

router.post('/translate', translate)
router.post('/third-party-translate', thirdPartyTranslate)

module.exports = router

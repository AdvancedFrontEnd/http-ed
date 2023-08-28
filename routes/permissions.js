const router = require('koa-router')()
const AuthCtl = require('../controller/auth')
router.prefix('/permissions')


router.post('/addPermission', AuthCtl.updateUserAuth)

module.exports = router
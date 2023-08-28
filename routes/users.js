const router = require('koa-router')()
const userCtl = require('../controller/user')
router.prefix('/user')

router.post('/login', userCtl.userLogin)

router.post('/register', userCtl.userRegister)

router.post('/delete', userCtl.userDelete)

router.post('/update', userCtl.userUpdate)

// router.get('/userData', userCtl.getUserData)
router.get('/user/userData/:userAccount', userCtl.getUserData);
module.exports = router
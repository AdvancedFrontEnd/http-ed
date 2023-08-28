// 期望增删改的路由
const router = require('koa-router')()
const hopeCtl = require('../controller/hope')
router.prefix('/hope')

// 获取接口信息
router.get('/getHopeInfo', hopeCtl.getHopeInfo)

// 创建接口
router.post('/create', hopeCtl.create)

// 更新接口信息
router.post('/update', hopeCtl.update)

// 删除接口信息
router.post('/delete', hopeCtl.deleteHope)

module.exports = router
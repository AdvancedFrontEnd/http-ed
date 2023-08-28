// 接口增删改查的文件
const router = require('koa-router')()
const interfaceCtl = require('../controller/interface')
router.prefix('/interface')

// 获取项目所有接口
router.get('/getAllInterface', interfaceCtl.getAllInterface)
// 获取接口信息
router.get('/getInterfaceInfo', interfaceCtl.getInterfaceInfo)
// 添加文件夹
router.post('/interfaceFilesAdd', interfaceCtl.addDirectory)

// 创建接口
router.post('/create', interfaceCtl.create)

// 更新接口信息
router.post('/update', interfaceCtl.update)

// 删除接口信息
router.post('/delete', interfaceCtl.deleteInterface)

router.post('/getInterfaceResult', interfaceCtl.parseInterface)


module.exports = router




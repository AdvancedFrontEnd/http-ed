const router = require('koa-router')()
const ProjectCtl = require('../controller/project')
router.prefix('/project')

router.get('/getAll', ProjectCtl.getProjects)
router.post('/create', ProjectCtl.createProject)
router.del('/delProject/:id', ProjectCtl.delProject)
router.post('/updateProject', ProjectCtl.updateProject)
module.exports = router
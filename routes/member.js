/*
 * @Author: lossercoder
 * @Date: 2023-08-11 10:10:01
 * @LastEditors: lossercode 
 * @LastEditTime: 2023-08-18 09:34:49
 * @Description: 项目成员管理相关路由
 */

const router = require('koa-router')()
const memberCtl = require('../controller/member')
router.prefix('/member')

router.post('/add', memberCtl.inviteMember)

router.get('/getMembers', memberCtl.getAll)

router.post('/delete', memberCtl.memberDelete)

router.post('/update', memberCtl.update)

router.post('/invite', memberCtl.showInvite)

// router.get('/getInviteMessage', memberCtl.getInviteMessage)

module.exports = router
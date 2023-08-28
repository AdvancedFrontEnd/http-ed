/**
 * 权限表的操作
 */

const { Permission } = require('../models/permissions');
const response = require('../utils/response');
const crud = require('./CRUDUtil/index');
const { isAssign } = require('../utils/common');


/**
 * 修改某单个用户的权限
 * @param {*} ctx 
 * @param {*} params 
 * @returns 
 */
const updateUserAuth = async (ctx, params) => {
    const userAccount = ctx.request.body.userAccount;
    const permission = ctx.request.body.permission || null;
    //    权限判空
    if (permission == null) {
        ctx.body = {
            code: 400,
            msg: '您传入了一个非法权限'
        }
        return
    }
    //    有没有这个用户
    const auth = await crud.findOne(Permission, { userAccount: userAccount, isDelete: false }, ctx);
    if (!auth) {
        ctx.body = response({
            code: 404,
            msg: "未找到该用户"
        });
        return;
    }

    const updatedAuth = Object.assign({}, auth._doc);
    isAssign(updatedAuth, { permission: permission });

    const updateResponse = await crud.update(Permission, { userAccount: userAccount }, { permission: permission });

    ctx.body = response({
        code: 200,
        msg: "权限表修改成功",
        updateResponse
    });
};

module.exports = {
    updateUserAuth
};
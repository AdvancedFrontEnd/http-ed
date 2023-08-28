const mongoose = require('mongoose')
const { Users } = require('../models/users');
const crud = require('./CRUDUtil/index');
const response = require('../utils/response');
const { generateToken } = require('../utils/jwt');
const { Permission } = require('../models/permissions');

/**
 * @Date: 2023-08-03 10:50:01
 * @Author: lossercode
 * @description: 用户注册
 * @param {*} ctx
 * @return {*}
 */
const userRegister = async (ctx) => {
    const { userAccount, userName, userPassword } = ctx.request.body
    if (!userAccount || !userName || !userPassword) {
        ctx.body = response(null, 400, '请输入正确的信息')
        return
    }
    // userAccount 是否重复
    const hasRegistry = await crud.findOne(Users, { userAccount: userAccount, isDeleted: false })
    if (hasRegistry) {
        ctx.body = response(null, 400, '账户已存在')
        return
    }
    const user = await crud.add(Users, {
        userAccount: userAccount,
        userName: userName,
        userPassword: userPassword,
        // 默认头像地址
        userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    })
    const token = generateToken({
        userAccount: userAccount,
    })
    ctx.body = response({
        userName: user.userName,
        userAccount: user.userAccount,
        createdTime: user.createdAt.replace(/T/, ' ').replace(/\..+/, ''),
        updatedTime: user.updatedAt.replace(/T/, ' ').replace(/\..+/, ''),
        userAvatar: user.userAvatar,
        token: token,
    })
}

/**
 * @Date: 2023-08-03 10:51:07
 * @Author: lossercode 
 * @description: 登录
 * @param {*} ctx
 * @return {*}
 */
const userLogin = async (ctx) => {
    const { userAccount, userPassword } = ctx.request.body
    const user = await crud.findOne(Users, {
        userAccount: userAccount,
        userPassword: userPassword,
        isDeleted: false
    })
    if (!user) {
        ctx.body = response(null, 400, '手机号或密码错误')
        return
    }
    const token = generateToken({
        userAccount: userAccount,
    })

    ctx.body = response({
        userName: user.userName,
        userAccount: user.userAccount,
        createdTime: user.createdAt,
        updatedTime: user.updatedAt,
        userAvatar: user.userAvatar,
        token: token,
    }, 200, "登录成功")
}

// 删除用户
const userDelete = async (ctx) => {
    let { userAccount } = ctx.request.body
    await crud.del(Users, { userAccount: userAccount }, ctx);
    ctx.body = response(null, 200, '删除成功')
};

// 更新用户信息
const userUpdate = async (ctx) => {
    let { userAccount, ...params } = ctx.request.body || null;
    await crud.update(Users, { userAccount: userAccount, isDeleted: false }, { ...params });
    ctx.body = response(null, 200, '更新成功')
};

const getUserData = async (ctx) => {
    const { userAccount } = ctx.params;
    const user = await crud.findOne(Users, { userAccount: userAccount, isDeleted: false });
    if (!user) {
        ctx.body = response(null, 404, '用户不存在');
        return;
    }
    console.log(user);
    ctx.body = response(user, 200, '获取用户信息成功');
};

module.exports = {
    userLogin,
    userRegister,
    userUpdate,
    userDelete,
    getUserData
};
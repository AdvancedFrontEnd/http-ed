/*
 * @Author: lossercoder
 * @Date: 2023-08-03 10:30:11
 * @LastEditors: lossercode 
 * @LastEditTime: 2023-08-23 18:26:15
 * @Description: 自定义封装一个 jwt 鉴权中间件
 */

const { decodeToken } = require('../utils/jwt');
const response = require('../utils/response');

async function jwtAuth(ctx, next) {
    // 不需要鉴权的地址，后续继续添加即可
    const ignorePath = [
        '/user/login',
        '/mock'
    ]
    const path = ctx.request.path

    if (ignorePath.some(ignore => path.startsWith(ignore))) {
        return next();
    }

    const token = ctx.get('authorization')?.trim()
    if (!token) {
        ctx.body = response(null, 401, '请先登录')
        return
    }
    try {
        const { userAccount } = decodeToken(token)
        // 解析出来的信息传递给下层中间件处理
        ctx.state.userAccount = userAccount
        await next()
    } catch (error) {
        console.log(error)
        ctx.body = response(null, 500, '系统错误')
    }
}

module.exports = jwtAuth
/**
 * @Date: 2023-08-03 10:53:26
 * @Author: lossercode
 * @description: jwt 相关处理方法
 * @return {*}
 */

const jwt = require('jsonwebtoken')

const generateToken =  (params) => {
    return jwt.sign(params, 'ByteDance-server-jwt', { expiresIn: 3600 * 24 * 7})
}

const decodeToken = (params) => {
    return jwt.verify(params, 'ByteDance-server-jwt')
}


module.exports = {
    generateToken,
    decodeToken
}
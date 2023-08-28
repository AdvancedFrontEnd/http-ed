/*
 * @Author: lossercoder
 * @Date: 2023-08-03 09:28:25
 * @LastEditors: lossercode 
 * @LastEditTime: 2023-08-03 09:42:05
 * @Description: 统一响应结果
 */

function response(data, code=200, msg='ok') {
    return {
        data: data,
        code: code,
        msg: msg
    }
}

module.exports = response
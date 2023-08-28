/*
 * @Author: lossercoder
 * @Date: 2023-08-03 09:42:43
 * @LastEditors: lossercode 
 * @LastEditTime: 2023-08-03 11:07:51
 * @Description: 简单粗暴的全局异常处理
 */

async function httpErrorHandler(ctx, next) {
  try {
    await next();
  } catch (error) {
    console.log(error);
    ctx.body = {
      code: 500,
      msg: "服务器内部错误",
      data: null,
    };
  }
}

module.exports = httpErrorHandler;
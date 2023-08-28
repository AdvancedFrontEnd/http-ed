/**
 * 这里是一些公共的crud方法
 */

/**
 * 
 * 用于查询数据的公共方法
 * @param {*} model 模型对象
 * @param {*} where 条件
 * @returns 
 */
const find = async (model, where) => {//传入两个模块，查找的目标，属于哪个模块,where:查询对象
    try {
        const result = await model.find(where || {});
        return result;
    } catch (error) {
        // 直接抛出错误，交由全局错误处理中间件处理, 下序方法相同
        throw new Error(error);
    }
}
/**
 * 添加数据的公共方法
 * @param {*} model 
 * @param {*} params 
 * @param {*} ctx 
 * @returns 
 */

const add = async (model, params) => {
    // create()用于向MongoDB中的Users集合中插入一条新的文档
    try {
        const result = await model.create(params);
        return result;
    } catch (error) {
        throw new Error(error);
    }
}
// const add = async (model, params) => {
//     try {
//         const result = await model.create(params);
//         return result;
//     } catch (error) {
//         if (error.code === 11000) {
//             // 处理唯一索引重复的情况
//             throw new Error("项目名称已存在");
//         } else {
//             // 处理其他异常情况
//             throw new Error(error.message);
//         }
//     }
// };

/**
 * 公共更新操作
 * @param {*} target 
 * @param {*} source 
 */

const update = async (model, where, params) => {
    try {
        const result = await model.updateOne(where, params);
        return result;
    } catch (error) {
        throw new Error(error);
    }
}
/**
 * 用于数据删除的公共方法
 * @param {*} model 
 * @param {*} where 
 * @param {*} ctx 
 */
const del = async (model, where, ctx) => {
    try {
        const result = await model.findByIdAndDelete(where);
        return result;
    } catch (error) {
        throw new Error(error);
    }
}
/**
 * 用于查询单个数据的公共方法
 * @param {*} model 
 * @param {*} where 
 * @param {*} ctx 
 */
const findOne = async (model, where) => {
    try {
        const result = await model.findOne(where || {});
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    find,
    add,
    update,
    del,
    findOne,
}
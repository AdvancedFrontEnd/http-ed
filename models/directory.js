/*
 * @Author: lossercoder
 * @Date: 2023-08-22 16:52:31
 * @LastEditors: lossercode 
 * @LastEditTime: 2023-08-22 22:58:18
 * @Description: 接口文件夹表
 */

const mongoose = require('mongoose')

const directorySchema = new mongoose.Schema({
    // 文件夹名称，同一个项目下的文件夹名称要唯一
    title: {
        type: String,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'projects',
        required: true
    },
    interfaces: {
        type: Array,
        default: []
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const Directory = mongoose.model('directories', directorySchema)
module.exports = {
    Directory
}
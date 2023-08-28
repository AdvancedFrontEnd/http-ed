const mongoose = require('mongoose')

const hopeSchema = new mongoose.Schema({
    // monogoose自动生成，不用管
    // _id: String,
    // 该期望所属的接口的id
    interfaceId:{
      type: String,
      required: true,
  },
    // 创建期望的用户Id
    createUserId: {
      type: String,
      required: true,
  },
    // 该期望的简介
    introduction: {
      type: String,
      required: true,
  },
    // 期望请求体
    requestParams: {
      type: [{
        name: String,
        value: mongoose.Schema.Types.Mixed
      }],
      require: false,
      default:[]
  },
    // 期望响应体
    data:{ 
      type: mongoose.Schema.Types.Mixed, 
      required: false ,
      default: {}
    },
    // 期望请求体数据类型
    requestType: {
      type: String,
      required: true,
  },
    // 期望响应体数据类型
    responseType: {
      type: String,
      required: true,
  },
    // 期望响应体数据类型
    requestMethod: {
      type: String,
      required: true,
  },
    // 请求头
    requestHeader: {
      type: [{
        name: String,
        value: String
      }],
      require: true
    },
    // 响应码
    responseCode: {
      type: String,
      required: true,
  },
    // 是否支持随机响应码
    isDynamicCode: {
      type: Boolean,
      default: false
  },
    // ​支持动态mock数据的字段
    isDynamicData: {
      type: Boolean,
      default: false
  },
    
  }, {timestamps: true})

  const Hope = mongoose.model('hope', hopeSchema)

  module.exports = {
    Hope
  }
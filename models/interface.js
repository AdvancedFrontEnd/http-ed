const mongoose = require('mongoose')

const interfaceSchema = new mongoose.Schema({
    // monogoose自动生成，不用管
    // 该接口所属的项目的id
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'projects',
      required: true
    },
    // 该接口的方法
    method: {
      type: String,
    },
    //该接口的请求地址
    url: String,
    //接口名称
    name: String,
    //接口状态, 0表示开发中，1表示已发布，2表示已废弃，……
    statu: String,
    //接口说明
    des: String,
    // 请求参数, 例如 Post 方法所携带的body信息等，用一个对象表示，或者也可以考虑拆分
    reqParams: {
      type: Array,
    },
    reqBody: {
      type: Array,
    },
    reqCookie: {
      type: Array,
    },
    reqHeader: {
      type: Array,
    },
    resInfo: {
      type: Array,
    },
    // 是否删除
    isDelete: {
      type: Boolean,
      default: false,
    }
  
  }, {timestamps: true})

  const Interface = mongoose.model('interface', interfaceSchema)

  module.exports = {
    Interface
  }
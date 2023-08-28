//接口表增删改

const mongoose = require("mongoose");
const { Hope } = require("../models/hope");
const { Interface } = require("../models/interface");
const {Permission} = require("../models/permissions")
const crud = require("./CRUDUtil/index");
const response = require("../utils/response");
const { generateToken } = require("../utils/jwt");

/**
 * @Date: 2023-08-12
 * @Author: xjm
 * @description: 获取期望信息
 * @param {*} ctx
 * @return {*}
 */
const getHopeInfo = async (ctx) => {
  const { interfaceId } = ctx.request.body;

  // 如果没有传入interfaceId
  if (!interfaceId) {
    ctx.body = response(null, 400, "请传入接口ID");
    return;
  }
  // 获取接口信息
  const hopeInfo = await crud.find(Hope, {
    interfaceId: interfaceId
  });
  if (!hopeInfo) {
    ctx.body = response(null, 400, "无法查询此接口");
    return;
  }
  res.status(200).json(hopeInfo)
};

/**
 * @Date: 2023-08-12
 * @Author: xjm
 * @description: 创建期望
 * @param {*} ctx
 * @return {*}
 */
const create = async (ctx) => {
  // 获取期望字段
  const {
    interfaceId,
    createUserId,
    introduction,
    requestParams,
    data,
    requestType,
    responseType,
    requestHeader,
    responseCode,
    isDynamicCode,
    isDynamicData
  } = ctx.request.body;
  if (!interfaceId || !createUserId) {
    ctx.body = response(null, 400, "请补充创建者或对应接口id");
    return;
  }
  // 查询对应接口属于哪个项目
  const { projectId } = await crud.findOne(Interface, {
    _id: interfaceId,
 });
  // 查询该用户是否有权限创建期望
  const user = await crud.findOne(Permission, {
     project_id: projectId,
     userAccount: createUserId,
     isDeleted: false,
  });
  // 如果该用户没有权限创建接口
  if (!user || user.role === 0) {
    ctx.body = response(null, 400, "该用户没有权限创建期望");
    return;
  }
  // 该用户有创建接口的权限时
  await crud.add(Hope, {
    interfaceId: interfaceId,
    createUserId: createUserId,
    introduction: introduction,
    requestParams: requestParams,
    data: data,
    requestType: requestType,
    responseType: responseType,
    requestHeader: requestHeader,
    responseCode: responseCode,
    isDynamicCode: isDynamicCode,
    isDynamicData: isDynamicData
  });

  // 返回创建的接口的信息
  ctx.body = response(null, 200, "接口创建成功");
  return;
};

/**
 * @Date: 2023-08-12
 * @Author: xjm
 * @description: 更新接口信息
 * @param {*} ctx
 * @return {*}
 */
const update = async (ctx) => {
  // 获取项目信息字段
  const {
    hopeId,
    interfaceId,
    createUserId,
    introduction,
    requestParams,
    data,
    requestType,
    responseType,
    requestHeader,
    responseCode,
    isDynamicCode,
    isDynamicData
  } = ctx.request.body;
  // 如果没有传入接口ID
  if(!hopeId) {
    ctx.body = response(null, 400, "请传入期望ID");
    return;
  }
  const { projectId } = await crud.findOne(Interface, {
    _id: interfaceId,
 });
  // 查询该用户是否有权限创建期望
  const user = await crud.findOne(Permission, {
     project_id: projectId,
     userAccount: createUserId,
     isDeleted: false,
  });
  // 如果该用户没有权限创建接口
  if (!user || user.role === 0) {
    ctx.body = response(null, 400, "该用户没有权限修改接口");
    return;
  }
  // 更新接口信息
  let res = await crud.update(Hope,{
      _id: hopeId
   },{
      introduction: introduction,
      requestParams: requestParams,
      data: data,
      requestType: requestType,
      responseType: responseType,
      requestHeader: requestHeader,
      responseCode: responseCode,
      isDynamicCode: isDynamicCode,
      isDynamicData: isDynamicData
    }
  )
  if(res) {
    ctx.body = response(null, 200, "接口修改成功");
    return;
  }
};

/**
 * @Date: 2023-08-12
 * @Author: xjm
 * @description: 删除期望
 * @param {*} ctx
 * @return {*}
 */
const deleteHope = async (ctx) => {
  const {interfaceId, createUserId, hopeId} = ctx.request.body
  // 检查是否传入接口ID、userId、projectId
  if(!interfaceId || !createUserId) {
    ctx.body = response(null, 400, "信息不完整，无法删除接口");
    return;
  }
  // 根据权限表去查找权限
  const { projectId } = await crud.findOne(Interface, {
    _id: interfaceId,
 });
  //查询该用户是否有权限创建接口
  const user = await crud.findOne(Permission, {
    project_id: projectId,
    userAccount: createUserId,
    isDeleted: false,
  });
  // 如果该用户没有权限创建接口
  if (!user || user.role === 0) {
    ctx.body = response(null, 400, "该用户没有权限删除接口");
    return;
  }
  // 查询表中是否存在该接口
  const hasHope = await crud.findOne(Hope, { _id: interfaceId, isDelete: false})
  if(!hasHope){
      ctx.body = response(null, 400, '数据库中不存在该期望')
      return
  }
  // 将接口字段的isDelected设置为true
  let res = await crud.update(Hope, 
    {_id: hopeId}, 
    {
      isDelete: true
    }
  )
  if(res) {
    ctx.body = response(null, 200, "接口删除成功");
    return;
  }
};

module.exports = {
  getHopeInfo,
  create,
  update,
  deleteHope,
};
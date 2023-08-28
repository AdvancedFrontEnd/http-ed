// 接口增删改查的文件
const mongoose = require("mongoose");
const { Interface } = require("../models/interface");
const { Permission } = require("../models/permissions");
const crud = require("./CRUDUtil/index");
const response = require("../utils/response");
const { generateToken } = require("../utils/jwt");
const parseInterfaceInfo = require("../utils/parseInterfaceInfo");
const { Directory } = require("../models/directory");

// 新建文件夹
const addDirectory = async (ctx) => {
  const {projectId, name} = ctx.request.body
  console.log(projectId, name)
  // todo: 检查是否重复
  
  const result = await crud.add(Directory, {
    projectId: projectId,
    title: name
  })

  ctx.body = response([{key: result._id, title: name, children: []}])
}

// 获取项目所有文件夹相关信息
const getAllInterface = async (ctx) => {
  const { projectId } = ctx.query
  // 把所有的目录信息转成指定格式返回前端
  const result = await crud.find(Directory, {
    projectId: projectId,
    isDelete: false
  })
  if(result){
    const data = result.map(directory => {
      return {
        key: directory._id,
        title: directory.title,
        children: directory.interfaces
      }
    })
    ctx.body = response(data)
  }else{
    ctx.body = response([])
  }

}

/**
 * @Date: 2023-08-04 10:50:01
 * @Author: fc
 * @description: 获取接口信息
 * @param {*} ctx
 * @return {*}
 */
const getInterfaceInfo = async (ctx) => {
  const { interfaceId } = ctx.query;

  // 如果没有传入interfaceId
  if (!interfaceId) {
    ctx.body = response(null, 400, "请传入接口ID");
    return;
  }
  // 获取接口信息
  const interfaceInfo = await crud.findOne(Interface, {
    _id: new mongoose.Types.ObjectId(interfaceId),
    isDelete: false,
  });
  if (!interfaceInfo) {
    ctx.body = response(null, 400, "无法查询此接口");
    return;
  }
  ctx.body = response(interfaceInfo);
};

/**
 * @Date: 2023-08-04 10:51:07
 * @Author: fc
 * @description: 创建接口
 * @param {*} ctx
 * @return {*}
 */
const create = async (ctx) => {
  const { userAccount } = ctx.state;
  // 获取项目信息字段, 项目id，接口信息，接口所在的目录
  const { projectId, data, directory } = ctx.request.body;

  // 查询该用户是否有权限创建接口
  const permission = await crud.find(Permission, {
    projectId: new mongoose.Types.ObjectId(projectId),
    userAccount: userAccount,
    isDelete: false,
  });
  console.log(permission);
  // 如果该用户没有权限创建接口
  if (!permission || permission.role > 2) {
    ctx.body = response(null, 400, "该用户没有权限创建接口");
    return;
  }
  // 该用户有创建接口的权限时
  const interface = await crud.add(Interface, {
    ...data,
    projectId: new mongoose.Types.ObjectId(projectId),
  });

  // 往文件夹表里添加一条数据
  console.log(directory)
  const file = await crud.findOne(Directory, {
    _id: new mongoose.Types.ObjectId(directory),
    isDelete: false
  })

  if(!file){
    ctx.body = response(null, 400, '文件夹不存在')
    return
  }
  console.log(file)
  try {
    // 更新当前目录下的接口信息
    file.interfaces.push({key: interface._id, title: `${interface.method} | ${interface.name}`, isLeaf: true})
    file.projectId = new mongoose.Types.ObjectId(projectId)
    await file.save()
    ctx.body = response({id: interface._id, name: interface.name})
  }catch(e){
    console.log(e)
    ctx.body = response(null, 500, '新建失败')
  }

};

/**
 * @Date: 2023-08-04 10:51:07
 * @Author: fc
 * @description: 更新接口信息
 * @param {*} ctx
 * @return {*}
 */
const update = async (ctx) => {
  const { userAccount } = ctx.state
  // 获取项目信息字段
  const {
    interfaceId,
    data
  } = ctx.request.body;
  // 如果没有传入接口ID
  if (!interfaceId) {
    ctx.body = response(null, 400, "请传入接口ID");
    return;
  }
  // 查询该用户是否有权限创建接口
  const user = await crud.findOne(Permission, {
    project_id: projectId,
    userAccount: userAccount,
    isDelete: false,
  });
  // 如果该用户没有权限创建接口
  if (!user || user.role > 2) {
    ctx.body = response(null, 400, "该用户没有权限修改接口");
    return;
  }
  // 更新接口信息
  let res = await crud.update(
    Interface,
    { _id: interfaceId },
    {...data}
  );
  if (res) {
    ctx.body = response(null, 200, "接口修改成功");
    return;
  }
};

/**
 * @Date: 2023-08-04 10:51:07
 * @Author: fc
 * @description: 删除接口
 * @param {*} ctx
 * @return {*}
 */
const deleteInterface = async (ctx) => {
  const { interfaceId, userId, projectId } = ctx.request.body;
  // 检查是否传入接口ID、userId、projectId
  if (!interfaceId || !userId || !projectId) {
    ctx.body = response(null, 400, "信息不完整，无法删除接口");
    return;
  }
  // 根据权限表去查找权限
  查询该用户是否有权限创建接口;
  const user = await crud.findOne(Permission, {
    project_id: projectId,
    userAccount: userId,
    isDeleted: false,
  });
  // 如果该用户没有权限创建接口
  if (!user || user.role === 0) {
    ctx.body = response(null, 400, "该用户没有权限删除接口");
    return;
  }
  // 查询表中是否存在该接口
  const hasInterface = await crud.findOne(Interface, {
    _id: interfaceId,
    isDelete: false,
  });
  if (!hasInterface) {
    ctx.body = response(null, 400, "数据库中不存在该接口");
    return;
  }
  // 将接口字段的isDelected设置为true
  let res = await crud.update(
    Interface,
    { _id: interfaceId },
    {
      isDelete: true,
    }
  );
  if (res) {
    ctx.body = response(null, 200, "接口删除成功");
    return;
  }
};

// 解析接口响应体
const parseInterface = async (ctx) => {
  const { interfaceId } = ctx.request.body;
  
  console.log(interfaceId)
  const interface = await crud.findOne(Interface, {
    _id: new mongoose.Types.ObjectId(interfaceId),
    isDelete: false,
  });

  if (!interface) {
    ctx.body = response(null, 400, "接口id错误");
    return
  }
  try {
    const data = parseInterfaceInfo(interface.resInfo);
    ctx.body = response(data);
  }catch(err){
    console.log(err)
    ctx.body = response(null, 400, '请检查响应体语法是否错误')
  }
};


module.exports = {
  getInterfaceInfo,
  create,
  update,
  deleteInterface,
  parseInterface,
  getAllInterface,
  addDirectory,
};

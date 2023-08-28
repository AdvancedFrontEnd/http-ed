
// const mongoose = require('mongoose')
// const router = new Router();
const { Projects } = require("../models/projects");
const { Permission } = require("../models/permissions");
const { Interface } = require("../models/interface");
const response = require("../utils/response");
const crud = require("./CRUDUtil/index");
const commonCtl = require("../utils/common");
const authCtl = require("./auth");

// 获取创建的项目,
const getProjects = async (ctx) => {
  const { userAccount } = ctx.state;
  // const { currentPage, pageSize, type } = ctx.query
  const { type } = ctx.query;

  // 先找到所有的project

  //   const allProjects = await Permission.find({
  //     userAccount: userAccount,
  //     isDelete: false,
  //   })
  //     .populate({
  //       path: "projectId",
  //       select: "projectName createdAt projectDesc",
  //       populate: { path: "userAccount", select: "userName" }
  //     }).exec();
  const allProjects = await Permission.aggregate([
    { $match: { userAccount: userAccount, isDelete: false } },
    {
      $lookup: {
        from: "projects",
        localField: "projectId",
        foreignField: "_id",
        as: "project",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userAccount",
        foreignField: "userAccount",
        as: "user",
      },
    },
    {
      $project: {
        projectName: "$project.projectName",
        projectDesc: "$project.projectDesc",
        userName: "$user.userName",
        createdAt: "$createdAt",
        permission: "$permission",
      },
    },
  ]).exec();
  // 项目总个数
  
  const total = allProjects.length;
  const project = allProjects
    .filter((project) =>
      type > 0 ? project.permission > 0 : project.permission === 0
    )
    .map((project) => {
      return {
        id: project._id,
        projectName: project.projectName[0],
        creator: project.userName[0],
        createdAt: commonCtl.formatTime(project.createdAt),
        projectDesc: project.projectDesc[0],
        // updateTime: commonCtl.formatTime(project.updatedAt),
        // total: total,
      };
    });
    console.log(project);
  // .slice(currentPage * pageSize, (currentPage+1) * pageSize < total ? (currentPage+1) * pageSize : total)
  ctx.body = response(project);
};

// 创建项目接口
const createProject = async (ctx) => {
  const { userAccount } = ctx.state;
  const { projectName, projectFile = null } = ctx.request.body;

  // 先判断下是否重复
  const project = await crud.find(Projects, {
    isDelete: false,
    projectName: projectName,
  });
  if (project.length > 0) {
    ctx.body = response(null, 400, "项目名重复");
    return;
  }
  // 项目表加入项目
  const result = await crud.add(Projects, {
    userAccount: userAccount,
    ...ctx.request.body,
  });
  // 往权限表加权限
  const _id = result._id;
  const authResule = await crud.add(Permission, {
    userAccount: userAccount,
    projectId: _id,
    permission: 0,
  });

  if(projectFile){
    const parsedSwagger = await parser.parse(projectFile.path);

    // 往文件夹表里添加一条数据
    const file = await crud.add(Directory, {
      projectId: new mongoose.Types.ObjectId(_id),
      name: 'swagger导入接口数据',
      isDelete: false
    })
  
    console.log(file)

    // 处理并导入接口信息
    await createInterface(parsedSwagger, file);
  }


  if (result && authResule) {
    ctx.body = response({ id: _id });
  } else {
    ctx.body = response(null, 500, "新建项目失败");
  }
};

// 删除项目接口(可回溯)
const delProject = async (ctx) => {
  const delID = ctx.params.id || null;
  const project = await crud.findOne(Projects, { _id: delID });
  if (!project) {
    ctx.body = response({ code: 404, msg: "项目不存在" });
    return;
  }
  if (project.isDelete) {
    ctx.body = response({ code: 200, msg: "项目已被删除" });
  }
  // const updatedProject = Object.assign({}, project._doc);
  // commonCtl.isAssign(updatedProject, newBody);
  const updateResponse = await crud.update(
    Projects,
    { _id: delID },
    { isDelete: true }
  );
  console.log(11111);
  const updatePermission = await crud.update(
    Permission,
    { projectId: delID },
    { isDelete: true }
  );
  try {
    ctx.body = response({
      code: 200,
      msg: "删除成功",
      updateResponse,
    });
  } catch (err) {
    throw new Error(err);
  }
};

const updateProject = async (ctx) => {
  const newBody = ctx.request.body || null;
  const project = await crud.findOne(Projects, {
    _id: newBody._id,
    isDelete: false,
  });
  if (!project) {
    ctx.body = response({ code: 404, msg: "项目不存在" });
    return;
  }
  const updatedProject = Object.assign({}, project._doc);
  assign(updatedProject, newBody);
  const updateResponse = await crud.update(
    Projects,
    { _id: newBody._id },
    updatedProject
  );
  ctx.body = response({
    code: 200,
    msg: "更新成功",
    updateResponse,
  });
};

const createInterface = async (data) => {

  const paths = data.paths || {};
  for (const [path, methods] of Object.entries(paths)) {
    // 遍历路径中的每个HTTP方法（GET、POST等）
    for (const [method, details] of Object.entries(methods)) {

      // 保存接口实例到数据库
      try {
        const interface = await crud.add(Interface, {
          projectId: details?.projectId,
          method,
          url: path,
          name: details?.name,
          status: details?.status,
          des: details?.description,
          reqParams: details?.parameters.filter((param) => param.in === 'query'),
          reqBody : details?.parameters.filter((param) => param.in === 'body'),
          reqCookie: details?.parameters.filter((param) => param.in === 'cookie'),
          reqHeader: details?.parameters.filter((param) => param.in === 'header'),
          resInfo: details?.responses,
          isDelete: false
        });
        // 更新当前目录下的接口信息
        file.interfaces.push({key: interface._id, title: `${interface.method} | ${interface.name}`, isLeaf: true})
        file.projectId = new mongoose.Types.ObjectId(projectId)
        await file.save()
        ctx.body = response({id: interface._id, name: interface.name})
        console.log('接口导入成功');
      } catch (error) {
        ctx.body = response(null, 500, '导入失败')
      }
    }
  }

};

module.exports = {
  createProject,
  delProject,
  updateProject,
  getProjects,
};

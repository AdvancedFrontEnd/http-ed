/*
 * @Author: lossercoder
 * @Date: 2023-08-11 10:19:36
 * @LastEditors: lossercode 
 * @LastEditTime: 2023-08-11 11:55:16
 * @Description: 项目成员操作
 */

const crud = require("./CRUDUtil/index");
const { Permission } = require("../models/permissions");
const response = require("../utils/response");
const { Invite } = require("../models/invite");
const { generateToken, decodeToken } = require("../utils/jwt");
const { Projects } = require("../models/projects");
const { Users } = require("../models/users");

// 获取所有成员信息
const getAll = async (ctx) => {
  const { projectId } = ctx.request.querystring;
  const members = await crud
    .find(Permission, { projectId: projectId, isDelete: false })
    .populate("Users", "userName")
    .exec();
  ctx.body = response(members);
};

// 更新成员权限
const update = async (ctx) => {
  const { projectId, permission, userAccount } = ctx.request.body;
  const member = await crud.find(Permission, {
    projectId: projectId,
    userAccount: userAccount,
    isDelete: false,
  });
  if (!member) {
    ctx.body = response(null, 400, "没有该用户");
    return;
  }
  try {
    member.permission = permission;
    await member.save();
    ctx.body = response(null, 200, "更新成功");
  } catch (error) {
    throw new Error(error.message);
  }
};

const memberDelete = async (ctx) => {
  const { projectId, userAccount } = ctx.request.body;
  const member = crud.find(Permission, {
    projectId: projectId,
    userAccount: userAccount,
    isDelete: false,
  });
  if (!member) {
    ctx.body = response(null, 400, "无此用户");
    return;
  }
  try {
    member.isDelete = true;
    await member.save();
    ctx.body = response(null, 200, "删除成功");
  } catch (error) {
    throw new Error(error.message);
  }
};

// 用户接受加入项目
// const add = async (ctx) => {
//   const { userAccount, inviteId } = ctx.request.body;
//   const invite = await crud.findOne(Invite, { _id: inviteId, isDelete: false });
//   if (!invite) {
//     ctx.body = response(null, 404, "无此邀请");
//     return;
//   }
//   const { projectId, permission } = invite;
//   // 往权限表里加入信息
//   const result = await crud.add(Permission, {
//     projectId: projectId,
//     permission: permission,
//     userAccount: userAccount,
//   });
//   if (!result) {
//     ctx.body = response(null, 500, "加入失败");
//     return;
//   }
//   // 删除该邀请
//   invite.isDelete = true
//   await invite.save();

//   ctx.body = response(null, 200, "加入成功");
// };

// 邀请成员加入项目
// const inviteMember = async (ctx) => {
//   const { memberAccount, permission } = ctx.request.body;
//   const { userAccount } = ctx.state.userAccount;
//   await crud.add(Invite, {
//     memberAccount: memberAccount,
//     creatorAccount: userAccount,
//     permission: permission,
//   });
//   ctx.body = response(null, 200, "已邀请,等待对方确认");
// };

// const getInviteMessage = async (ctx) => {
//   const { userAccount } = ctx.state.userAccount;
//   const invite = await crud
//     .find(Invite, { memberAccount: userAccount, isDelete: false })
//     .populate("Users", "userName")
//     .populate("Projects", "projectName")
//     .exex();

//   ctx.body = response({
//     id: invite._id,
//     creatorName: invite.userName,
//     projectName: invite.projectName,
//   });
// };

// 邀请用户的第二种方法
const inviteMember = async (ctx) => {
    const { userAccount } = ctx.state.userAccount;
    const { permission, projectId } = ctx.request.body
    // 使用 jwt 进行加密，有效期 7 天
    const token = generateToken({permission: permission, projectId: projectId, creatorAccount: userAccount})
    ctx.body = response(token)
}

// 展示邀请链接页面
const showInvite = async (ctx) => {
    const { token } = ctx.request.querystring
    const { permission, projectId, creatorAccount } = decodeToken(token)
    const project = await crud.find(Projects, { projectId: projectId, isDelete: false})
    const creator = await crud.find(Users, { userAccount: creatorAccount, isDelete: false})
    if(!project || !creator) {
        ctx.body = response(null, 400, '邀请已失效')
        return
    }
    ctx.body = response({
        projectName: project.projectName,
        creator: creator.userName,
        permission: permission
    })
}

// 被邀请成员同意加入项目
const addMember = async (ctx) => {
    const { userAccount } = ctx.state.userAccount
    const { projectId, permission } = ctx.request.body
    await crud.add(Permission, { projectId: projectId, permission: permission, userAccount: userAccount})
    ctx.body = response(null, 200, '已成功加入项目')
}
module.exports = {
  inviteMember,
  getAll,
  update,
  memberDelete,
  addMember,
  showInvite,
  inviteMember
};

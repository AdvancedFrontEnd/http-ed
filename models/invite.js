/*
 * @Author: lossercoder
 * @Date: 2023-08-11 10:37:23
 * @LastEditors: lossercode 
 * @LastEditTime: 2023-08-18 09:30:08
 * @Description: 邀请信息表
 */

const mongoose = require("mongoose");
const inviteSchema = new mongoose.Schema(
  {
    // 邀请表的id，自动生成
    
    // 创建者的手机号
    creatorAccount: { 
        type: String,
        required: [true, "User account is required"],
        ref: "Users",
    },
    // 被邀请的用户的手机号
    memberAccount: {
      type: String,
      required: [true, "User account is required"],
      ref: "Users",
    },
    // 被邀请的项目
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    permission: {
        type: Number,
        required: true,
        enum: [0, 1, 2, 3] // 0:经理（多个删除项目），1：管理员，2：开发人员，3：非开发人员（只读）
    },
    isDelete: {
        type: Boolean,
        default: false
    }
  },
  { timestamps: true }
);

const Invite = mongoose.model("invite", inviteSchema);
module.exports = {
  Invite
};

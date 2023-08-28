const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    // 项目名称，需唯一
    projectName: {
      type: String,
      required: true,
      unique: true,
    },
    // 项目图标，主要用在前端展现，可设可不设
    projectAvatar: {
      type: String,
      default: "",
    },
    // 项目创建者的手机号
    userAccount: {
      type: String,
      refPath: "users",
      required: true,
    },
    // 是否删除该项目
    isDelete: {
      type: Boolean,
      default: false,
    },
    // 开发环境地址
    devEnvironment: {
      type: String,
      default: "",
    },
    // 正式环境服务器地址
    prodEnvironment: {
      type: String,
      default: "",
    },
    // 项目描述信息
    projectDesc: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true
  }
);

const Projects = mongoose.model("projects", projectSchema);

module.exports = {
  Projects,
};

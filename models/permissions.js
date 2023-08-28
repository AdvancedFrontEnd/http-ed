const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    userAccount: {
        type: String,
        // 注意不能用ref，因为ref默认比对_id
        refPath: 'users',
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'projects',
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
}, { timestamps: true });

const Permission = mongoose.model('permissions', permissionSchema);

module.exports = { Permission };
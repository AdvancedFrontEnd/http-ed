const mongoose = require('mongoose');
const { generateSalt, hashPassword } = require('../utils/salt');

const userSchema = new mongoose.Schema({
    // 用户手机号
    userAccount: {
        type: String,
        required: [true, 'User account is required'],
        unique: true,
    },
    // 密码，用户手机号
    userPassword: {
        type: String,
        required: [true, 'User password is required'],
        validate: {
            validator: function (v) {
                return v && v.length >= 6;
            },
            message: props => `Password must be at least 6 characters.`
        },
        select: false
    },
    salt: {
        type: String, // 将 salt 字段定义为 String 类型
        required: true,
    },
    // 头像
    userAvatar: {
        type: String,
        default: '',
        required: false
    },
    // 用户名
    userName: {
        type: String,
        required: false
    },
    // 是否注销
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// 在保存用户数据之前生成盐值并对密码进行加盐和哈希处理
userSchema.pre('save', function (next) {
    if (this.isModified('userPassword')) {
        const salt = generateSalt();
        const hashedPassword = hashPassword(this.userPassword, salt);
        this.userPassword = hashedPassword;
        this.salt = salt;
    }
    next();
});

const Users = mongoose.model('users', userSchema);
module.exports = {
    Users
};
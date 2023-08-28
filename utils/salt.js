const crypto = require('crypto');
// 生成盐值
const generateSalt = () => {
    return crypto.randomBytes(16).toString('hex');
};

// 对密码进行加盐和哈希
const hashPassword = (password, salt) => {
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hashedPassword;
};

module.exports = { generateSalt, hashPassword };
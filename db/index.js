const mongoose = require('mongoose')

module.exports = () => {
    //connect有两个参数，一个是数据库的地址，第二个是相关配置
    /**useNewUrlParser是 Mongoose 连接 MongoDB 数据库时的一个选项，
    用于告诉 Mongoose 使用 MongoDB 连接字符串中的新的解析器（parser）。 */
    mongoose.connect('mongodb://root:yuzhihui@120.25.178.186:27017/ByteDance?authSource=admin', { useNewUrlParser: true }).then(() => {
        console.log('数据库连接成功');
    }).catch(err => {
        console.log('账号连接失败', err);
    });
}

const crypto = require('crypto')
const SECRET_KEY = "SyxsiyunxinABCD980104"

//md5加密
function md5(content) {
    let md5 = crypto.createHash('md5');

    return md5.update(content).digest('hex')
}

//加密函数
function generatePassword(password){
    let str=`password=${password}&key=${SECRET_KEY}`
    return md5(str)
}
// console.log(generatePassword('123'))

module.exports = {
    generatePassword
}
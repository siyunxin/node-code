const fs = require('fs');
const path = require('path');
//创建写入流
function createWriteStream(fileName) {
    let fullFileName = path.join(__dirname, '../', '../', 'logs', fileName);
    let writeStream = fs.createWriteStream(fullFileName, {
        flags: 'a'
    })
    return writeStream
}

//写日志
function writeLog(writeStream, log) {
    writeStream.write(log + '\n')
}
//访问日志
const accessStream = createWriteStream('access.log')

function access(log) {
    writeLog(accessStream, log)
}

module.exports = {
    access
}
const file = require('fs')
const path = require('path')

const fileData = path.resolve(__dirname,'test.txt')
//读取文件
/* file.readFile(fileData, (err, data) => {
    if(err){
        console.log(err)
        return
    }

    console.log(data.toString())

}) */
 
//写入文件
const content = "这是写入的内容"
const opt = {
    flag: 'a'  //a: 追加 w:覆盖
}

/* file.writeFile(fileData, content, opt, (err) => {
    if (err) {
        console.log(err)
        return
    }
}) */

//判断文件是否存在

file.exists(fileData, (exists) => {
    console.log(exists)
})
const fs = require('fs')
const path = require('path')

const fileData = path.resolve(__dirname, 'test1.txt')
const fileData2 = path.resolve(__dirname, 'test2.txt')

const readStream = fs.createReadStream(fileData)
const writeStream = fs.createWriteStream(fileData2)

readStream.pipe(writeStream)

readStream.on('end', () => {
    console.log('copy done')
})
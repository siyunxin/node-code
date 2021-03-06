const mysql = require('mysql')

const { MYSQL_CONF } = require('../conf/db.js')

//创建连接

const con = mysql.createConnection( MYSQL_CONF )

//开启连接

con.connect()

function exec(sql){
    const promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if(err){
                reject(err)
                return
            }
            resolve(result)
        })
    })

    return promise
}

module.exports = {
    exec,
    escape: mysql.escape
}
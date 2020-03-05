
const { exec, escape } = require('../db/mysql')
const {generatePassword} = require('../utils/cryp')
const loginCheck = (username, password) => {
   /*  if(username==="嘿嘿", password==="12345"){
        return true
    } 
    return false */

    username = escape(username)
    password = escape(generatePassword(password))
    let sql = `SELECT username, realname FROM users WHERE username=${username} AND password=${password}`;

    return exec(sql).then((rows) => {
        return rows[0] || {}
    })
}

module.exports = {
    loginCheck
}
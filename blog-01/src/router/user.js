const {loginCheck} = require('../controller/user')
const {SuccessModel, ErrorModel} = require('../model/resModel')
const {set} = require('../db/redis')
const serverUserRouter = ( req, res ) => {
    const method = req.method
    const url = req.url
    const path = url.split('?')[0]
    //登录
    if( method === "POST" && path === "/api/user/login") {
       let { username, password } = req.body;
    //    let { username, password } = req.query; 
       
       const loginData = loginCheck(username, password)
       return loginData.then((data) => {
            if (!data.username) {
                return new ErrorModel("登录失败")
            } 
            req.session.username = data.username;
            req.session.realname = data.realname;
            set(req.sessionId, req.session)
            return new SuccessModel(data)
       })
    }

    /* if(method === "GET" && path === "/api/login-test"){
        if(req.session.username){
            console.log(req.cookie.username)
            return Promise.resolve(new SuccessModel({
                username: req.session.username
            }))
        }
        return Promise.resolve(new ErrorModel())
    } */
}

module.exports = serverUserRouter
const queryString = require('querystring')
const serverBlogRouter = require('./src/router/blog')
const serverUserRouter = require('./src/router/user')
const { get, set } = require('./src/db/redis')
const { access } = require('./src/utils/log')
const SESSION_DATA = {};
const getExpiresDate = () => {
    let d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    return d.toGMTString()
}
//处理postData
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        //判断非Post请求
        if (req.method !== "POST") {
            console.log(1)
            resolve({})
            return
        }
        //判断 header文本格式
        if (req.headers['content-type'] !== "application/json") {
            console.log(0)
            resolve({})
            return
        }
        //接收post数据
        let postData = '';
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })


    return promise
}
const serverHandle = (req, res) => {
    //设置返回json格式
    res.setHeader('Content-type', 'application/json');
    // 获取url
    const url = req.url;
    //解析query
    access(`${req.method}---${url}---${req.headers['user-agent']}---${Date.now()} `)
    req.query = queryString.parse(url.split('?')[1]);
    //解析cookie
    req.cookie = {};
    const cookieStr = req.headers.cookie || "";
    cookieStr.split(';').forEach( item => {
        if(!item) {
            return 
        }

        let arr = item.split('=');
        let key = arr[0].trim();
        let value = arr[1].trim();
        req.cookie[key] = value;
    })

    //处理session
    /* let needSetCookie = false;
    let userId = req.cookie.userid;
    if(userId) {
        if(!SESSION_DATA[userId]){
            SESSION_DATA[userId]= {}
        }
    }else{
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`;
        SESSION_DATA[userId] = {};
    }
    req.session = SESSION_DATA[userId] */

    let needSetCookie = false
    let userId = req.cookie.userid
    console.log('userId', userId)
    if (!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        // 初始化 redis 中的 session 值
        set(userId, {})
    }
    // 获取 session
    req.sessionId = userId
    get(req.sessionId).then(sessionData => {
        console.log("redis session", sessionData)
        if (sessionData == null) {
            // 初始化 redis 中的 session 值
            set(req.sessionId, {})
            // 设置 session
            req.session = {}
        } else {
            // 设置 session
            req.session = sessionData
        }
        // console.log('req.session ', req.session)

        // 处理 post data
        return getPostData(req)
    }).then(postData => {
        req.body = postData;
        
        //处理路由
        console.log(req.session)
        const blogResult = serverBlogRouter(req, res)

        if (blogResult) {
            console.log('blogResult',blogResult)
            blogResult.then((blogData) => {
                if(needSetCookie){
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; Expires=${getExpiresDate()}`);
                }
                res.end(
                    JSON.stringify(blogData)

                )
            })
            return
        }

        // 登录
        const userResult = serverUserRouter(req, res)
        if (userResult) {
            if(needSetCookie){
                res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; Expires=${getExpiresDate()}`);
            }
            userResult.then((data) => {
                res.end(
                    JSON.stringify(data)

                )
            })
            return
        }
        //匹配不到的情况
        res.writeHead(404, {
            "Content-type": "text/plain"
        });
        res.write('404 not Found');
        res.end();

        //博客

        /* const blogData = serverBlogRouter(req, res)
        if (blogData) {
            res.end(
                JSON.stringify(blogData)
            )
            return
        } */
        

    })



}

module.exports = serverHandle
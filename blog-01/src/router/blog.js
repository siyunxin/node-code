const { getList, postBlog, getDetail, updateBlog, deleteBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel') 
const loginCheck = (req) => {
    console.log("session", req.session)
    if(!req.session.username){
        return Promise.resolve(
            new ErrorModel('尚未登录')
        )
        
    }
} 
const serverBlogRouter = (req, res) => {
    const method = req.method;
    const url = req.url;
    const path = url.split('?')[0]
    console.log("路由", path)
    //查询一篇博客

    if( method === "GET" && path === "/api/blog/detail"){
        const id = req.query.id
        const result = getDetail(id)
        return result.then((detail) => {
            return new SuccessModel(detail)
        })
    }
    // 查询博客文章列表
    if( method === "GET" && path === "/api/blog/list" ) {
        let isAdmin = req.query.isadmin
        
        let author = req.query.author || '';
        let keyword = req.query.keyword || '';
        if(isAdmin){
            author = req.session.username
        }
        /* const blogList = getList(author, keyword);
        return new SuccessModel(blogList) */
        const result = getList(author, keyword)
        return result.then((blogList) => {
            return new SuccessModel(blogList)
        })
    
    }
    //添加博客
    if( method === "POST" && path === "/api/blog/add") {
        

        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            return loginCheckResult
        }
        req.body.author = req.session.username;
        const addblog = postBlog(req.body)
        return addblog.then((data) => {
            return new SuccessModel(data)
        })
    }
    //修改编辑博客
    if( method === "POST" && path === "/api/blog/update") {

        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            return loginCheckResult
        }

        const id = req.query.id;
        const updateData = updateBlog(id, req.body);
        return updateData.then((data) => {
            console.log(data)
            if(data) {
                return new SuccessModel(data)
            } else {
                return new ErrorModel("更新失败")
            }
            
        })
    }
    // 删除博客
    if( method === 'POST' && path === "/api/blog/del") {

        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            return loginCheckResult
        }
        let id = req.query.id;
        let author = req.session.username;
        const deleteData = deleteBlog(id, author)
        return deleteData.then( (data) => {
            console.log('data', data)
            if(data){
                return new SuccessModel(data)
            }else{
                return new ErrorModel("删除失败")
            }
        })
    }
}

module.exports = serverBlogRouter
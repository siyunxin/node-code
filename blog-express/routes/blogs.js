var express = require('express');
var router = express.Router();
var loginCheck = require('../middleware/loginCheck')
const {
    getList,
    deleteBlog
} = require('../controller/blog')
const {
    SuccessModel,
    ErrorModel
} = require('../model/resModel')
router.get('/list', loginCheck, (req, res, next) => {
    let author = req.query.author
    if (req.query.isadmin) {
        if (req.session.username === "null") {
            return new ErrorModel('未登录')
        }
        author = req.session.username
    }
    let listResult = getList(author)
    return listResult.then((data) => {
        res.json(
            new SuccessModel(data)
        )
    })

})
router.post('/del', loginCheck, (req, res, next) => {
    let id = req.query.id;
    let author = req.session.username;
    const deleteData = deleteBlog(id, author)
    return deleteData.then((data) => {
        console.log('data', data)
        if (data) {
            res.json(
                new SuccessModel(data)
            )
            return
        } 
        res.json(
            new ErrorModel("删除失败")
        )
            
        
    })
})


module.exports = router
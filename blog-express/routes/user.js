var express = require('express')
var router = express.Router()
const {login } = require('../controller/user.js')
const {SuccessModel, ErrorModel} = require('../model/resModel')
router.post('/login', (req, res, next) => {
    
    let {username, password} = req.body
    let loginResult = login(username, password)
   
    return loginResult.then((data) => {
        if( data.username ) {
            req.session.username = data.username;
            req.session.password = data.password
            res.json(
                new SuccessModel()
            )
            return
        } 
        
        res.json(
            new ErrorModel()
        )
    }) 
})

module.exports = router
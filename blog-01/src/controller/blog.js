const {
    exec
} = require('../db/mysql')

const {xss} = require('xss')
//获取博客列表
const getList = (author, keyword) => {
    let sql = `SELECT * FROM blogs WHERE 1=1 `;
    if (author) {
        sql += `AND author='${author}' `
    };
    if (keyword) {
        sql += `AND title LIKE '%${keyword}%' `
    };

    sql += "ORDER BY createtime DESC;"

    return exec(sql)
}
//获取博客详情
const getDetail = (id) => {
    let sql = `SELECT * FROM blogs WHERE id='${id}';`
    return exec(sql).then((rows) => {
        return rows[0]
    })
}
//添加博客
const postBlog = (blogData) => {
    let author = blogData.author;
    let title = xss(blogData.title);
    let content = blogData.content;
    let createtime = Date.now()
    let sql = `INSERT INTO blogs (title, content, createtime, author) VALUES ('${title}','${content}','${createtime}','${author}');`;
    return exec(sql).then((data) => {
        return data.insertId
    })
}

//更新
const updateBlog = (id, blogData) => {
    let title = blogData.title;
    let content = blogData.content;
    let sql = `UPDATE blogs SET title='${title}', content='${content}' WHERE id='${id}';`

    return exec(sql).then((data) => {
        console.log('updatedata', data)
        if (data.affectedRows > 0) {
            return true
        }
        return false
    })
}

//删除

const deleteBlog = (id, author) => {
    let sql = `DELETE FROM blogs WHERE id='${id}' AND author='${author}' `
    console.log(sql)
    return exec(sql).then((data) => {
        console.log(data)
        if (data.affectedRows > 0) {
            return true
        }
        return false
    })
}

module.exports = {
    getList,
    postBlog,
    getDetail,
    updateBlog,
    deleteBlog
}
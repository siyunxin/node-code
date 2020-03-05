const http = require('http');
const queryString = require('querystring')
const server = http.createServer((req, res) => {
    const method = req.method,
          url = req.url,  //请求url
          path = url.split('?')[0],  //请求路径
          query = queryString.parse(url.split('?')[1]),//get参数
          resData = {
            method,
            url,
            path,
            query
        }
    //设置返回格式为 JSON    
    res.setHeader('Content-type', 'application/json') 
    //GET
    if(method === 'GET'){
        res.end(
            JSON.stringify(resData)
        )
    }
    //POST
    if(method === 'POST'){
        let postData = ''
        //拼接数据流
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            resData.postData = postData
            res.end(
                JSON.stringify(resData)
            )
        })
    }
})

server.listen(3000, ()=>{
    console.log('server success')
})
const http = require('http');
const queryString = require('querystring')

const serve = http.createServer((req, res) => {
    var method = req.method;
    console.log('method', method) //get
    const url = req.url
    console.log('url', url)
    if (method === "GET") {

        req.query = queryString.parse(url.split('?')[1])
        console.log("query", req.query)
        res.end(
            JSON.stringify(req.query)
        )
    } else if (method === "POST") {
        console.log('content-type', req.headers['content-type']);
        let postData = '';
        req.on('data', chunk => {
            postData += chunk.toString();
        })
        req.on('end', () => {
            console.log('postData', postData);
            console.log('helloWorld')
        })
    }

})

serve.listen(3000, () => {
    console.log('server success')
})
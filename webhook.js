let http = require('http')
let crypto = require('crypto')
const { spawn } = require('child_process')
let SECRET = 'github'
function sign(body) {
  return `sha1=${crypto.createHmac('sha1', SECRET).update(body).digest('hex')}`
}
let server = http.createServer(function(req, res) {
  console.log(req.method, req.url)
  if (req.method == 'POST' && req.url == '/test-vue-webhook-cicd') {

    let buffers = []

    req.on('data', function(buffer) {
      buffers.push(buffer)
    })
    req.on('end', function(buffer) {
      let body = buffer.concat(buffers)
      console.log('req: ', JSON.stringify(req))
      let event = req.headers['x-github-event'] // event = push
      // github 请求来的时候 要传递请求题body  另外还会传一个签名过来 signature，你需要本地校验签名是否正确
      let signature = req.headers['x-gihub-signature']
      if (signature !== sign(body)) {
        res.end('Not allowed')
      } else {
        console.log('github签名串本地校验正确')
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ok: true}))
        if (event == 'push') { // 开始部署
          let payload = JSON.parse(body)
          console.log('payload', payload)
          // spawn('sh', [`./${payload.repository.name}`])
        }
      }
    })
    
  } else {
    res.end('Not Found')
  }
})

server.listen(4000, () => {
  console.log('webhook服务已经在4000端口上启动')
})
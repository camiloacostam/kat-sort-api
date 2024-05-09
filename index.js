const http = require('node:http')

const port = process.env.PORT || 3000

const server = http.createServer((req, res) => {
  console.log('Request received!', req.url)
  res.end('Hello, world!')
})

server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

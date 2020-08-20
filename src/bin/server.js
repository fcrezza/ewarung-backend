import app from '../app'
import http from 'http'

const port = process.env.PORT || '4000'
app.set('port', port)

const server = http.createServer(app)
server.listen(port)
server.on('listening', onListening)

function onListening() {
  var addr = server.address()
  var bind = typeof addr === 'string' ? addr : addr.port
  console.log(`server listen on port ${bind}`)
}

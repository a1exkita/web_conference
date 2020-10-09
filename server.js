const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})

server.listen(process.env.PORT)

// const { ExpressPeerServer } = require('peer');
// const app2 = express();
// const http2 = require('http');
// const server2 = http2.createServer(app2);
// const peerServer = ExpressPeerServer(server2, {
//   debug: true,
//   path: '/myapp'
// });

var PeerServer = require('peer').PeerServer;
var server2 = PeerServer({port: 443, path: '/peerjs'});
server2.listen(9000)
// app2.use('/peerjs', peerServer);
// app2.listen(9000)
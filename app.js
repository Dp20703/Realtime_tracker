const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index.ejs');
});

// socket io:
// connection to socket.io
io.on('connection', (socket) => {
    console.log("Connect to socket.io");


    // send location event received from user
    socket.on('send-location', (data) => {

        //  send received location to user
        io.emit('receive-location', { id: socket.id, ...data })
    })

    // disconnect from socket.io
    socket.on('disconnect', () => {
        // send disconnect to user
        io.emit("user-disconnected", socket.id);
        console.log("Disconnected to socket.io", socket.id);
    })
})


server.listen(4000, () => {
    console.log('server is running on port http://localhost:4000');
})
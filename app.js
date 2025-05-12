const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*",  // Adjust as needed for your frontend
        methods: ["GET", "POST"]
    }
});


// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Ensures views path is set

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
    res.render('index'); // No need to add .ejs
});

// Socket.io connections
io.on('connection', (socket) => {
    console.log('Connected to socket.io:', socket.id);

    // Receive location from client and broadcast to others
    socket.on('send-location', (data) => {
        io.emit('receive-location', { id: socket.id, ...data });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        io.emit('user-disconnected', socket.id);
        console.log('Disconnected from socket.io:', socket.id);
    });
});

// Dynamic port for deployment compatibility
// Dynamic port for deployment compatibility
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


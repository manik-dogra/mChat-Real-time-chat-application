// Node server which will handle socket io connections
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const port = process.env.PORT || 3000;
const users = {};
const io=require('socket.io')(server);

// To access the css and js in the public folder
app.use(express.static(__dirname+'/public'));

// index.html sent on the localhost:3000
app.get('/', (req, res)  =>{
    res.sendFile(__dirname+'/index.html')
})

// connection with the socket
io.on('connection', socket =>{
    // after a new user joind a event will be emit
    socket.on('new-user-joined', name =>{
        users[socket.id] = name;
        // and a message will be sent to all users using broadcast
        socket.broadcast.emit('user-joined', name);
    });

    // when sent event will be emit a broadcast with receive emit will be fire
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    });

    // when a user disconnect this event will be fired
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})

server.listen(3000);
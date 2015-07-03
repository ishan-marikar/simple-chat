// Set up express and socket.io
var express = require("express");
var app    = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// so we can join directory paths in a
// more platform agnostic way
var path = require("path");

// Set the public folder as static so we can access it's contents
// __dirname holds the current directory path
app.use(express.static( path.join( __dirname , 'public') ) );

// Whenever a client connects
io.on("connection", function (socket) {
    // send the client that connected a welcome message,
    // through a channel we will call 'message'.
    // the message will be sent in an named-array/dictionary
    // we will only be sending it to the client that connected
    // 'connected' contains an array/object of every client that is connected
    // socket.id is id of the client that connected.
    io.sockets.connected[socket.id].emit('message', {'message':'Welcome to the chat!'});
    // we will be listening for any messages sent by the client on the 'message' channel
    // when a message is received on the 'message' channel
    socket.on('message', function (data){
        // output the message (for debugging purposes)
        console.log("Relaying message to clients: ", data);
        // and send the message to all other clients on the 'message' channel
        io.emit('message', data);
    });
});

console.log("Server is running ..");
server.listen(3000);
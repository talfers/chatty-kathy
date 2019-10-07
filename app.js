var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// Create server with http client
var http = require("http").createServer(app);
// Require socket.io
var io = require('socket.io')(http);
const port = process.env.PORT || 5000;

//bodyparser middleware
app.use(bodyParser.json());

// Set dist folder
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('index');
})

let USERS = [];

io.on('connection', function(socket) {
    socket.username = 'Anonymous';
    const newUser = {id: socket.id, username: socket.username};
    USERS.push(newUser)
    io.emit('update_display_names', {users: [...USERS]})
    //console.log(`User: ${socket.username} connected`);
    socket.on('disconnect', () => {
      const newUsersArr = USERS.filter(user => user.id !== socket.id);
      USERS = newUsersArr;
      io.emit('update_display_names', {users: [...USERS]})
      //console.log('Disconnected')
    })
    socket.on('change_username', function({id, username}){
      //console.log(`username now: ${username}`);
      let user = USERS.find(user => user.id === id)
      const users = USERS.filter(user => user.id !== id)
      user.username = username;
      USERS = [...users, user];
      io.emit('update_display_names', {users: [...USERS]})
      socket.username = username;
    })
    socket.on('new_message', function(msg) {
      //console.log(`message: ${msg}, username: ${socket.username}`);
      io.emit('received', {message: msg, username: socket.username, id: socket.id})
    })
    socket.on('typing', function() {
      socket.broadcast.emit('show_typing', {username: socket.username});
    })


});




// listen on server
http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Client side socket instance
const socket = io();

// Select DOM elements
const chat = document.querySelector('#chat-view');
const user_form = document.querySelector('#user-form');
const user_input = document.querySelector('#user-input');
const msg_form = document.querySelector('#msg-form');
const msg_input = document.querySelector('#msg-input');
const isTyping = document.querySelector('#typing');

//Initialize message function
(function() {

  // Update username
  user_form.addEventListener('submit', (e) => {
    e.preventDefault();
    // localStorage.setItem("user", user_input.value);
    socket.emit('change_username', user_input.value);
    user_input.value = '';
    return true;
  })

  // Listen for submit
  msg_form.addEventListener('submit', (e) => {
    e.preventDefault();
    socket.emit('new_message', msg_input.value);
    msg_input.value = '';
    return true;
  })

  socket.on('received', (data) => {
    const {username, message} = data;
    let li = document.createElement("li");
    let span = document.createElement("span");
    li.className = 'msg';
    span.className = 'username';
    li.innerText = message;
    span.innerText = username;
    li.appendChild(span)
    chat.appendChild(li)
  })

})();

// Indicate typing
//(function(){
  //var searchTimeout;
  //msg_input.onkeypress = function () {
      //socket.emit('typing');
      //if (searchTimeout != undefined) clearTimeout(searchTimeout);
      //searchTimeout = setTimeout(clearTypingScript, 1000);
  //};
  //socket.on('show_typing', ({username}) => {
    //isTyping.innerText = `${username} is typing...`;
  //})
  //function clearTypingScript() {
    //isTyping.innerText = '';
  //}
//})();

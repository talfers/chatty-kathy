// Client side socket instance
const socket = io();

// Select DOM elements
const chat = document.querySelector('#chat-view');
const user_view = document.querySelector('#user-view');
const user_form = document.querySelector('#user-form');
const user_input = document.querySelector('#user-input');
const msg_form = document.querySelector('#msg-form');
const msg_input = document.querySelector('#msg-input');
const isTyping = document.querySelector('#typing');
const username = document.querySelector('#username');
const username_view = document.querySelector('#username-view');
const edit_username = document.querySelector('#username-edit');
const back_btn = document.querySelector('.btn-back');
const numUsers = document.querySelector('#num-users');

//Initialize message function
(function() {

  // Update username
  user_form.addEventListener('submit', (e) => {
    e.preventDefault();
    // localStorage.setItem("user", user_input.value);
    socket.emit('change_username', {id: socket.id, username: user_input.value});
    username.innerText = user_input.value;
    user_input.value = '';
    user_form.style.display = 'none';
    username_view.style.display = 'flex';
    return true;
  })

  // Listen for username edit
  edit_username.addEventListener('click', (e) => {
    e.preventDefault();
    user_input.value = username.innerText;
    username_view.style.display = 'none';
    user_form.style.display = 'block';
    return true;
  })

  // Listen for submit
  msg_form.addEventListener('submit', (e) => {
    e.preventDefault();
    socket.emit('new_message', msg_input.value);
    msg_input.value = '';
    return true;
  })

  socket.on('get_item', async () => {
    const storage = await localStorage.getItem('username');
    if(storage) {
      username.innerText = storage;
      user_input.value = '';
      user_form.style.display = 'none';
      username_view.style.display = 'flex';
    }
    socket.emit('parse_storage', storage);
  });

  socket.on('received', (data) => {
    const {id, username, message, created} = data;
    const time = Date(created).substring(0, 21);
    let li = document.createElement("li");
    let span = document.createElement("span");
    li.className = 'msg';
    span.className = 'msg-data';
    if(socket.id !== id) {
      li.className = 'msg msg-received'
    }
    li.innerText = message;
    span.innerHTML = `<span>${username}</span><span class='time'>${time}</span>`;
    li.appendChild(span)
    chat.appendChild(li)
  });

  socket.on('set_storage', (username) => {
    localStorage.setItem('username', username);
  });

  socket.on('update_display_names', (data) => {
    user_view.innerHTML = '';
    numUsers.innerText = '';
    numUsers.innerText = `(${data.users.length})`;
    data.users.forEach(user => {
      const userCard = document.createElement('div');
      userCard.className = 'user-card';
      userCard.innerHTML = `<i class="fas fa-circle"></i> ${user.username}`;
      user_view.appendChild(userCard);
    });
  });

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

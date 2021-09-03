import { Chatroom } from './src/chat.js';
import { ChatUI } from './src/ui.js';

// DOM
let formMessage = document.querySelector('#formMessage');
let inputMessage = document.querySelector('#inputMessage');
let deleteMessage = document.querySelectorAll('.delete');
// console.log(deleteMessage);

let formUsername = document.querySelector('#formUsername');
let inputUsername = document.querySelector('#inputUsername');

let rooms = document.querySelector('nav');
let roomsBtns = document.querySelectorAll('nav .btn');
let activeBtn = document.querySelector('#general');

let ulChatList = document.querySelector('ul');
let changedUsername = document.querySelector('#changedUsername');

//Local Storage
let checkUsername = () => {
  if (localStorage.usernameLS) {
    return localStorage.usernameLS;
  } else {
    return 'anonymous';
  }
};

let checkRoom = () => {
  if (localStorage.roomLS) {
    return localStorage.roomLS;
  } else {
    return 'general';
  }
};

//Create class instances
let chatroom1 = new Chatroom(checkRoom(), checkUsername());
let chatUI1 = new ChatUI(ulChatList, chatroom1 );

//Print message
chatroom1.getChats((data, id) => {
  chatUI1.templateLI(data, id);
});

// Event Listeners

//Send message
formMessage.addEventListener('submit', e => {
  e.preventDefault();
  let message = inputMessage.value;
  let trimMessage = message.trim();
  if (trimMessage == '') {
    alert('Unesite poruku!');
  } else {
    chatroom1
      .addChat(trimMessage)
      .then(() => formMessage.reset())
      .catch(error => console.log(error));
  }
});

//Update username
formUsername.addEventListener('submit', e => {
  e.preventDefault();
  let newUsername = inputUsername.value;
  let oldUsername = localStorage.usernameLS;

  chatroom1.updateUsername(newUsername);
  formUsername.reset();

  // Username in paragraf
  changedUsername.innerHTML = newUsername;
  setTimeout(function () {
    changedUsername.innerHTML = '';
  }, 3000);

  // Change username in DOM
  chatUI1.afterUsernameChanged(oldUsername, newUsername);
});

// Change room
rooms.addEventListener('click', e => {
  if (e.target.tagName == 'BUTTON') {
    let newRoom = e.target.id;
    chatroom1.updateRoom(newRoom);
    chatUI1.clear();
    chatroom1.getChats((data, id) => {
      chatUI1.templateLI(data, id);
    });
  }
});

// Active buttons
document.addEventListener('DOMContentLoaded', () => {
  roomsBtns.forEach(function (btn) {
    btn.addEventListener('click', () => {
      if (activeBtn != null) {
        activeBtn.classList.remove('active');
      }
      btn.classList.add('active');
      activeBtn = btn;
    });
  });
});

// Delete message
ulChatList.addEventListener('click', event => {
  if (
    event.target.tagName == 'IMG' &&
    event.target.classList.contains('trashImg')
  ) {
    let elem = event.target.parentElement;
    let id = event.target.getAttribute('id');
    console.log(event.target, id);
    chatUI1.onDeleteUserRequest ( elem, id )
  }
});

// Change background color
let updateColor = document.querySelector('#colorChange');
let backgroundColor1 = document.querySelector('body');
let inputColor = document.querySelector('#favcolor');

if (localStorage.color) {
  document.body.style.backgroundColor = localStorage.color;
} else {
  document.body.style.backgroundColor = '#ffffff';
}

updateColor.addEventListener('submit', event => {
  event.preventDefault();
  let newColor = inputColor.value;

  setTimeout(function () {
    document.body.style.backgroundColor = newColor;
  }, 500);
  localStorage.setItem('color', newColor);
});

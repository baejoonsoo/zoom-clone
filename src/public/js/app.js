const socket = io();

const welcome = document.querySelector('#welcome');
const form = welcome.querySelector('#joinRoom');
const firstName = welcome.querySelector('#name');
const room = document.querySelector('#room');

room.hidden = true;

let roomName;
let nickname = null;

const addMessage = (message) => {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = message;
  ul.appendChild(li);
};

const handleMessageSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector('#message input');

  const value = input.value;
  socket.emit('newMessage', value, roomName, () => {
    addMessage(`You : ${value}`);
  });

  input.value = '';
};

const roomTitle = (newCount) => {
  const h3 = room.querySelector('h3');
  h3.innerText = `Room ${roomName} (${newCount})`;
};

const handleNicknameSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector('#name input');

  socket.emit('nickname', input.value);

  input.value = '';
};

const showRoom = (newCount) => {
  welcome.hidden = true;
  room.hidden = false;

  roomTitle(newCount);

  const msgForm = room.querySelector('#message');
  const nameForm = room.querySelector('#name');
  msgForm.addEventListener('submit', handleMessageSubmit);
  nameForm.addEventListener('submit', handleNicknameSubmit);
};

const handleRoomSubmit = (event) => {
  event.preventDefault();
  const input = form.querySelector('input');
  socket.emit('enter_room', input.value, nickname, showRoom);
  roomName = input.value;
  input.value = '';
};

form.addEventListener('submit', handleRoomSubmit);

firstName.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = firstName.querySelector('input');
  nickname = input.value;
  input.value = '';
});

socket.on('welcome', (user, newCount) => {
  roomTitle(newCount);
  addMessage(`${user} arrived!`);
});

socket.on('bye', (left, newCount) => {
  roomTitle(newCount);
  addMessage(`${left} left`);
});

socket.on('newMessage', addMessage);

socket.on('roomChange', (rooms) => {
  const roomList = welcome.querySelector('ul');
  roomList.innerHTML = '';

  rooms.forEach((room) => {
    const li = document.createElement('li');
    li.innerText = room;
    roomList.append(li);
  });
});

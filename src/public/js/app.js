const socket = io();

const welcome = document.querySelector('#welcome');
const form = welcome.querySelector('form');
const room = document.querySelector('#room');

room.hidden = true;

let roomName;

const addMessage = (message) => {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = message;
  ul.appendChild(li);
};

const handleMessageSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector('input');

  const value = input.value;
  socket.emit('newMessage', value, roomName, () => {
    addMessage(`You : ${value}`);
  });

  input.value = '';
};

const showRoom = () => {
  welcome.hidden = true;
  room.hidden = false;

  const h3 = room.querySelector('h3');
  h3.innerText = `Room ${roomName}`;

  const Form = room.querySelector('form');
  Form.addEventListener('submit', handleMessageSubmit);
};

const handleRoomSubmit = (event) => {
  event.preventDefault();
  const input = form.querySelector('input');
  socket.emit('enter_room', input.value, showRoom);
  roomName = input.value;
  input.value = '';
};

form.addEventListener('submit', handleRoomSubmit);

socket.on('welcomeMessage', () => {
  addMessage('someone joined!');
});

socket.on('bye', () => {
  addMessage('someone left!');
});

socket.on('newMessage', addMessage);

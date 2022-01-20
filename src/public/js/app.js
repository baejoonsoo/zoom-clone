const socket = io();
const welcome = document.querySelector("#welcome");
const form = welcome.querySelector("form");

const done = (msg) => {
  console.log(`this message : ${msg}`);
};

const handleRoomSubmit = (event) => {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", { payload: input.value });
  input.value = "";
};

form.addEventListener("submit", handleRoomSubmit);

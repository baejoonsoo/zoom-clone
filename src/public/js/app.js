const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nickNameForm = document.querySelector("#nickName");

const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("connected to server");
});

socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

socket.addEventListener("close", () => {
  console.log("disconnected from server");
});

const makeMessage = (type, payload) => {
  const msg = { type, payload };
  return JSON.stringify(msg);
};

const handleSubmit = (event) => {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("message", input.value));
  input.value = "";
};

const handleNickSubmit = (event) => {
  event.preventDefault();
  const input = nickNameForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
  input.value = "";
};

messageForm.addEventListener("submit", handleSubmit);
nickNameForm.addEventListener("submit", handleNickSubmit);

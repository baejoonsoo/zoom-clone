import express from "express";
import http from "http";
import SocketIO from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));

const handleListen = () => console.log("Listening on http://localhost:8000");

// app.listen(8000, handleListen);
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket.on("enter_room", (roomName) => {
    socket.join(roomName);
  });
});

{
  /*
  const wss = new WebSocket.Server({ server });
const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anon";
  console.log("connected to the browser");

  socket.on("close", () => console.log("disconnected from the browser"));

  socket.on("message", (msg) => {
    // console.log();
    const message = JSON.parse(msg.toString("utf8"));

    switch (message.type) {
      case "message":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${message.payload}`)
        );
      case "nickname":
        socket["nickname"] = message.payload;
    }
  });
  socket.send("hello");
});
*/
}

httpServer.listen(8000, handleListen);

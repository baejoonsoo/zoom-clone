import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => res.render('home'));

const handleListen = () => console.log('Listening on http://localhost:3000');

// app.listen(8000, handleListen);
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on('connection', (socket) => {
  socket['nickname'] = 'Anon';
  socket.on('enter_room', (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit('welcomeMessage', socket.nickname);
  });

  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit('bye', socket.nickname),
    );
  });

  socket.on('newMessage', (message, roomName, done) => {
    socket.to(roomName).emit('newMessage', `${socket.nickname} : ${message}`);
    done();
  });

  socket.on('nickname', (nickname) => (socket['nickname'] = nickname));
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

httpServer.listen(3000, handleListen);

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => res.render('home'));

const handleListen = () => console.log('Listening on http://localhost:3000');

// app.listen(8000, handleListen);
const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
  cors: {
    origin: ['https://admin.socket.io'],
    credentials: true,
  },
});

instrument(wsServer, {
  auth: false,
});

const publicRoom = () => {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;

  const publicRooms = [];

  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });

  return publicRooms;
};

const countRoom = (roomName) => {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
};

wsServer.on('connection', (socket) => {
  // socket['nickname'] = 'Anon';

  socket.onAny((event) => {
    console.log(wsServer.sockets.adapter);
    console.log(`socket event : ${event}`);
  });

  socket.on('enter_room', (roomName, nickname, done) => {
    socket.join(roomName);
    socket['nickname'] = nickname || 'Anon';
    done(countRoom(roomName));
    socket.to(roomName).emit('welcome', socket.nickname, countRoom(roomName));
    wsServer.sockets.emit('roomChange', publicRoom());
  });

  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit('bye', socket.nickname, countRoom(room) - 1),
    );
  });

  socket.on('disconnect', () => {
    wsServer.sockets.emit('roomChange', publicRoom());
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

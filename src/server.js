import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));

const handleListen = () => console.log("Listening on http://localhost:8000");

// app.listen(8000, handleListen);
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const handleConnection = (event) => {
  console.log(event);
};

wss.on("connection", handleConnection);

server.listen(8000, handleListen);

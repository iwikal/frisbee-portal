const httpServer = require("http").createServer();
const { v4: uuidv4 } = require('uuid');
import { Player } from './shared/player';

let players = new Map()
var allClients = new Map<any, String>();

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:1234",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket: any) => {
  
  let token: String = uuidv4();
  let player: Player = new Player(token, 10, 10)
  players.set(token, player)
  
  // Send data to newly connected client
  socket.emit('newUser', {token: token, player: player, players: JSON.stringify([...players])});

  // Broadcast that someone new has connected
  socket.broadcast.emit('connectedUserBroadcast', {token: token, player: player})

  socket.on('disconnect', function() {
    console.log("Someone disconnected")

    // Remove player from players list
    players.delete(token)

    // Broadcast to all clients that player disconnected
    socket.broadcast.emit('disconnectedUserBroadcast', {token: token})
  });
});

httpServer.listen(3000);
const httpServer = require("http").createServer();
const { v4: uuidv4 } = require('uuid');
import { Player } from './shared/player';

let players = new Map()

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:1234",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket: any) => {
  
  let token: String = uuidv4();
  let player: Player = new Player(10, 10)
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

  socket.on('playerMoved', (data: any) => {
    // Broadcast to everyone the new location of the player
    socket.broadcast.emit('playerMoved', {token: token, x: data.newX, y: data.newY})
  })

  socket.on('event', (data: any) => {
    console.log(`event ${data}`)
    socket.broadcast.emit('event', data)
  })
});

httpServer.listen(3000);
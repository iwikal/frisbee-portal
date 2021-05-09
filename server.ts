import { createServer } from 'http'
import { v4 as uuidv4 } from 'uuid'
import { Player } from './shared/player'

const colors: string[] = ['red', 'blue', 'green', 'magenta', 'yellow', 'cyan']
const players = new Map<string, Player>()

const httpServer = createServer()

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:1234",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket: any) => {
  const token: string = uuidv4();
  console.log(`${token} connected`)

  const color = colors.pop()
  const player: Player = new Player(10, 10, color)
  console.log(`Player ${token} was assigned color ${color}`)

  players.set(token, player)
  
  // Send data to newly connected client
  socket.emit('newUser', {token, player, players: JSON.stringify([...players])});

  // Broadcast that someone new has connected
  socket.broadcast.emit('connectedUserBroadcast', {token, player})

  socket.on('disconnect', function() {
    console.log(`${token} disconnected`)

    // Re-add color to the pool
    const p = players.get(token)
    if (p !== undefined) {
      colors.push(p.color)
      console.log(`Color ${p.color} returned to color pool`)
    } else {
      console.log("No color was returned to the pool")
      console.log(players)
    }

    // Remove player from players list
    players.delete(token)

    // Broadcast to all clients that player disconnected
    socket.broadcast.emit('disconnectedUserBroadcast', {token: token})
  });

  socket.on('playerMoved', (data: any) => {
    player.x = data.newX
    player.y = data.newY
    // Broadcast to everyone the new location of the player
    socket.broadcast.emit('playerMoved', {token: token, x: data.newX, y: data.newY})
  })
});

const port: number = (+process.argv[2]) ?? 3000

httpServer.listen(port);

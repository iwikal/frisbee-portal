import { GameEntity, Transform, Vector } from "./gamestate";
import { Command } from "./command";
import { io } from "socket.io-client";
import { World, Wall } from "./world"
import { Player } from "../shared/player"

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement
const context: CanvasRenderingContext2D = canvas.getContext("2d")

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  socket.send("Hi, can I play?");
});

let localPlayer: Player
let myToken: String

socket.on("newUser", data => {
  // When someone joins when there are people already connected
  currentState.players = new Map(JSON.parse(data.players))
  localPlayer = data.player
  myToken = data.token
});

socket.on('connectedUserBroadcast', data => {
  // Add new user when they connect
  currentState.players.set(data.token, data.player)
});

socket.on('disconnectedUserBroadcast', data => {
  // Remove a user when they disconnect
  currentState.players.delete(data.token)
});

socket.on('playerMoved', data => {
  // Update a player's position
  currentState.players.get(data.token).x = data.x
  currentState.players.get(data.token).y = data.y
});

let commands: Command[]

const tickTime: number = 1000/60

window.addEventListener('resize', resizeCanvas)

const startTime: number = Date.now()

class GameState extends GameEntity {
  world: World
  players = new Map();
  transform: Transform;
  phi = 0
  angVel = 0.005

  constructor(canvas: HTMLCanvasElement) {
    super(
      new Vector(canvas.width, canvas.height),
      {position: new Vector(100, 100), rotation: 0},
      {style: ()=>"#fff"}
    )
    this.transform = {
      position: new Vector(100, 100),
      rotation: 0,
    }

    this.world = new World(new Vector(canvas.width, canvas.height));

    const wallSize = new Vector(50, 50)

    for (const i of [0, 1]) {
      const wall = new Wall(
        wallSize,
        {
          position: new Vector(100 + 200 * i, 100),
          rotation: 0
        }
      )
      this.world.walls.push(wall)
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.world.draw(ctx)
    ctx.fillStyle = "#f0f"
    const radius = 50
    const xPos = 100
    const yPos = 100
    const xOffset = Math.cos(this.phi) * radius
    const yOffset = Math.sin(this.phi) * radius
    ctx.fillRect(xPos + xOffset, yPos + yOffset, 100, 100)
  }

  update(dt: number, commands: Command[]) {
    this.phi = this.phi + this.angVel * dt
  }
}

let currentState = new GameState(canvas)

function clearCanvas() {
  const previousFillStyle = context.fillStyle
  context.fillStyle = "#fff"
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = previousFillStyle
}

function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  currentState.draw(context)
}

function drawLoop(lastFrameTime: number, acc: number) {
  return () => {
    const currentTime = Date.now() - startTime
    acc += currentTime - lastFrameTime

    while (acc >= tickTime) {
      if (localPlayer !== undefined) {

        if (localPlayer.lastX !== localPlayer.x || localPlayer.lastY !== localPlayer.y) {
          localPlayer.lastX = localPlayer.x
          localPlayer.lastY = localPlayer.y
          localPlayer.moved = true
        }
      }
      
      currentState.update(tickTime, commands)
      acc -= tickTime

      commands = []
    }


    if (localPlayer !== undefined && localPlayer.moved) {
      socket.emit('playerMoved', {newX: localPlayer.x, newY: localPlayer.y})
      localPlayer.moved = false
    }

    clearCanvas()
    currentState.draw(context)

    window.requestAnimationFrame(drawLoop(currentTime, acc))
  }
}

drawLoop(0, 0)()
resizeCanvas()


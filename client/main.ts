import { GameEntity, Position } from "./gamestate";
import { Command } from "./command";
import { io } from "socket.io-client";
import { World, Wall } from "./world"
import { Player } from "../shared/player"
import { v4 as uuidv4 } from "uuid"

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement
const context: CanvasRenderingContext2D = canvas.getContext("2d")

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  socket.send("Hi, can I play?");
});

let localPlayer: Player;

socket.on("newUser", data => {
  // When someone joins when there are people already connected
  currentState.players = new Map(JSON.parse(data.players))
  localPlayer = data.player
  console.log(currentState.players)
});

socket.on('connectedUserBroadcast', data => {
  // Add new user when they connect
  console.log("New user connected")
  currentState.players.set(data.token, data.player)
  console.log(currentState.players)
});

socket.on('disconnectedUserBroadcast', data => {
  // Remove a user when they disconnect
  console.log("A user has disconnected")
  currentState.players.delete(data.token)
  console.log(currentState.players)
});

let commands: Command[]

const tickTime: number = 1000/60

window.addEventListener('resize', resizeCanvas)

const startTime: number = Date.now()

class GameState implements GameEntity {
  world = new World();
  position: Position;
  players = new Map();

  constructor() {
    this.position = {
      x: 100,
      y: 100,
      r: 0
    }

    this.phi = 0

    const [width, height] = [50, 50]

    for (const i of [0, 1]) {
      const wall = new Wall()
      wall.pos.x = i * 200
      wall.pos.x += 100
      wall.pos.y += 100
      wall.size = new DOMPoint(width, height)
      this.world.walls.push(wall)
    }
  }

  update(dt: number, commands: Command[]) {
    this.phi = this.phi + 0.005 * dt
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

  showPlayers(): void {
    for (let [token, player] of this.players) {
      console.log(token, player)
    }
  }

  phi: number;
}

let currentState = new GameState()

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
    if (acc >= tickTime) {
      console.log("Tick!")
      currentState.update(tickTime, commands)
      acc -= tickTime
      commands = []
      clearCanvas()
      currentState.draw(context)
    }
    window.requestAnimationFrame(drawLoop(currentTime, acc))
  }
}

drawLoop(0, 0)()
resizeCanvas()


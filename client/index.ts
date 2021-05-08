import { GameEntity, Position } from "./gamestate";
import { Command } from "./command";
import { io } from "socket.io-client";

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement
const context: CanvasRenderingContext2D = canvas.getContext("2d")

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  socket.send("Hello!");
});

// handle the event sent with socket.send()
socket.on("message", data => {
  console.log(data);
});

let commands: Command[]

const tickTime: number = 1000/60

window.onresize = resizeCanvas
const startTime: number = Date.now()

class GameState implements GameEntity {
  position: Position;

  constructor() {
    this.position = {
      x: 100,
      y: 100,
      r: 0
    }

    this.phi = 0
  }

  update(dt: number, commands: Command[]) {
    this.phi = this.phi + 0.005 * dt
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#f0f"
    const radius = 50
    const xPos = 100
    const yPos = 100
    const xOffset = Math.cos(this.phi) * radius
    const yOffset = Math.sin(this.phi) * radius
    ctx.fillRect(xPos + xOffset, yPos + yOffset, 100, 100)
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

function drawLoop(lastFrameTime: number) {
  return () => {
    const currentTime = Date.now() - startTime
    let acc = currentTime - lastFrameTime
    if (acc >= tickTime) {
      console.log("Tick!")
      currentState.update(tickTime, commands)
      acc -= tickTime
      commands = []
      clearCanvas()
      currentState.draw(context)
    }
    window.requestAnimationFrame(drawLoop(currentTime))
  }
}

drawLoop(0)()
resizeCanvas()


import { GameEntity, Transform, Vector } from "./gamestate";
import { Command } from "./command";
import { io } from "socket.io-client";
import { World, Wall } from "./world"

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

window.addEventListener('resize', resizeCanvas)

const startTime: number = Date.now()

class GameState extends GameEntity {
  world: World
  transform: Transform;
  phi = 0
  angVel = 0.005

  constructor(canvas: HTMLCanvasElement) {
    super(
      new Vector(canvas.width, canvas.height),
      {position: new Vector(100, 100), rotation: 0},
      ["Style", "#fff"]
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
      currentState.update(tickTime, commands)
      acc -= tickTime
      commands = []
    }

    clearCanvas()
    currentState.draw(context)

    window.requestAnimationFrame(drawLoop(currentTime, acc))
  }
}

drawLoop(0, 0)()
resizeCanvas()


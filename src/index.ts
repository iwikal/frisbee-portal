<<<<<<< HEAD
import { GameEntity, Position } from "./gamestate";
import { Command } from "./command"
||||||| 93cf524
import { updateLanguageServiceSourceFile } from "typescript";
import { GameEntity } from "./gamestate";
=======
import { GameEntity } from "./gamestate";
>>>>>>> 0930f357f8eb671863abdb8f6b285032b5c14c08

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement
const context: CanvasRenderingContext2D = canvas.getContext("2d")

let commands: Command[]

const tickTime: number = 1000/60

window.onresize = resizeCanvas
const startTime: number = Date.now()

class GameState implements GameEntity {
<<<<<<< HEAD
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
||||||| 93cf524
  phi: number = 0;
  update(dt) {
=======
  phi: number = 0;
  update(dt: number) {
>>>>>>> 0930f357f8eb671863abdb8f6b285032b5c14c08
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


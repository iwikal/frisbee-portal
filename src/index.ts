import { GameEntity } from "./gamestate";

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement
const context: CanvasRenderingContext2D = canvas.getContext("2d")

class GameState implements GameEntity {
  phi: number = 0;
  update(dt: number) {
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

resizeCanvas()

window.onresize = resizeCanvas

const startTime = Date.now()
let lastFrameTime = 0
let time = 0
let deltaT = 0

function drawLoop() {
  clearCanvas()
  lastFrameTime = time
  time = Date.now() - startTime
  deltaT = time - lastFrameTime
  currentState.update(deltaT)
  currentState.draw(context)
  window.requestAnimationFrame(drawLoop)
}

drawLoop()

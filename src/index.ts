const canvas = document.getElementById("canvas") as HTMLCanvasElement
const context = canvas.getContext("2d")

function clearCanvas() {
  context.fillStyle = "#fff"
  context.fillRect(0, 0, canvas.width, canvas.height)
}

function draw() {
  clearCanvas()
  context.fillStyle = "#f0f"
  const phi = time * 0.005
  const radius = 50
  const xPos = 100
  const yPos = 100
  const xOffset = Math.cos(phi) * radius
  const yOffset = Math.sin(phi) * radius
  context.fillRect(xPos + xOffset, yPos + yOffset, 100, 100)
}

function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  draw()
}

resizeCanvas()

window.onresize = resizeCanvas

const startTime = Date.now()
let lastFrameTime = 0
let time = 0
let deltaT = 0

function drawLoop() {
  lastFrameTime = time
  time = Date.now() - startTime
  deltaT = time - lastFrameTime
  draw()
  window.requestAnimationFrame(drawLoop)
}

drawLoop()

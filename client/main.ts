import { GameEntity } from "./gamestate";
import { Transform, Vector } from "../shared/vector";
import { Command, keyBindings } from "./command";
import { io } from "socket.io-client";
import { World, Wall } from "./world"
import { Player } from "../shared/player"
import { PlayerEntity } from "./PlayerEntity"
import { Frisbee } from "./Frisbee";

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement
const context: CanvasRenderingContext2D = canvas.getContext("2d")

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  socket.send("Hi, can I play?");
});

function assertNever(x: never): never {
  throw new Error(`supposedly unreachable code executed: ${x}`)
}

socket.on("disconnect", (reason) => {
  switch (reason) {
    case 'ping timeout':
      alert('connection timed out')
      break
    case 'transport close':
      alert('connection closed')
      break
    case 'transport error':
    case 'io server disconnect':
    case 'io client disconnect':
      alert('connection broke')
      break
    default:
      assertNever(reason)
  }
})

let currentPlayer: PlayerEntity | undefined
let myToken: string | undefined

socket.on("newUser", data => {
  // When someone joins when there are people already connected
  myToken = data.token
  if (currentState === undefined) {
    currentState = new GameState(canvas)
    drawLoop(0, 0)()
  }

  const players = JSON.parse(data.players) as [string, Player][]

  for (const [token, playerData] of players) {
    const player = new PlayerEntity(
      50,
      {
        position: new Vector(playerData.x, playerData.y),
        rotation: 0
      },
      playerData.color,
      token
    )
    if (token === myToken) {
      currentPlayer = player
    }
    currentState.world.children.push(player)
    currentState.players.set(token, player)
  }
});

socket.on('connectedUserBroadcast', data => {
  // Add new user when they connect
  if (currentState !== undefined) {
    const player = new PlayerEntity(
      50,
      {
        position: new Vector(data.player.x, data.player.y),
        rotation: 0
      },
      data.player.color,
      data.token
    )
    currentState.world.children.push(player)
    currentState.players.set(data.token, player)
  }
});

socket.on('disconnectedUserBroadcast', data => {
  // Remove a user when they disconnect
  commands.push({
    time: 0, // FIXME
    source: data.token,
    payload: {disconnect: {}},
  })
  currentState?.players.delete(data.token)
});

socket.on('playerMoved', data => {
  // Update a player's position
  commands.push({
    time: 0 /* or whatever the server says */,
    source: data.token,
    payload: {setOwnPosition: new Vector(data.x, data.y)}
  })
});

let commands: Command[] = []

const tickTime: number = 1000/60

window.addEventListener('resize', resizeCanvas)

const startTime: number = Date.now()

class GameState extends GameEntity {
  world: World
  players = new Map<string, PlayerEntity>();
  transform: Transform;

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

    const roomWidth = 800
    const roomHeight = 600
    const wallThickness = 50

    for (const [size, position] of [
      [new Vector(wallThickness, roomHeight - wallThickness), new Vector(-roomWidth / 2, 0)],
      [new Vector(wallThickness, roomHeight - wallThickness), new Vector(roomWidth / 2, 0)],
      [new Vector(roomWidth + wallThickness, wallThickness), new Vector(0, -roomHeight / 2)],
      [new Vector(roomWidth + wallThickness, wallThickness), new Vector(0, roomHeight / 2)],
    ]) {
      this.world.children.push(new Wall(
        size,
        { position, rotation: 0 }
      ))
    }

    this.world.children.push(new Frisbee(30, new Vector()))
  }

  draw(ctx: CanvasRenderingContext2D) {
    const prevTransform = ctx.getTransform()
    const { width, height } = ctx.canvas
    ctx.translate(width / 2, height / 2)
    this.world.draw(ctx)
    ctx.setTransform(prevTransform)
  }

  update(dt: number, commands: Command[]) {
    this.world.update(dt, commands)
    return true
  }
}

let currentState: GameState // = new GameState(canvas)

function clearCanvas() {
  const previousFillStyle = context.fillStyle
  context.fillStyle = "#fff"
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = previousFillStyle
}

function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  if (currentState !== undefined) {
    currentState.draw(context)
  }
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

    if (currentPlayer?.moved) {
      const { x, y } = currentPlayer.transform.position
      socket.emit('playerMoved', { newX: x, newY: y })
      currentPlayer.moved = false
    }

    clearCanvas()
    currentState.draw(context)

    window.requestAnimationFrame(drawLoop(currentTime, acc))
  }
}

window.addEventListener("keydown", (evt) => {
  if ( ! evt.repeat ) {
    for (const [symbolicKey, keycode] of keyBindings.entries()) {
      if (keycode === evt.code) {
        commands.push({
          time: Date.now(),
          source: myToken,
          payload: {keydown: symbolicKey}
        })
      }
    }
  }
})

window.addEventListener("keyup", (evt) => {
  for (const [symbolicKey, keycode] of keyBindings.entries()) {
    if (keycode === evt.code) {
      commands.push({
        time: Date.now(),
        source: myToken,
        payload: {keyup: symbolicKey}
      })
    }
  }
})

resizeCanvas()

import { GameEntity } from "./gamestate"
import { Transform, Vector } from "../shared/vector";
import { Command, MOVE_NORTH, MOVE_SOUTH, MOVE_EAST, MOVE_WEST } from "./command"

type MoveKey = 'north' | 'south' | 'east' | 'west'

export class PlayerEntity extends GameEntity {
  token: string

  moveKeysPressed: Record<MoveKey, boolean>
  moved: boolean
  speed: number

  constructor(size: number, transform: Transform, color: string, token: string) {
    const path = new Path2D()
    path.arc(-size / 2, -size / 2, size / 2, 0, 2 * Math.PI)
    super(new Vector(size, size), transform, {style: () => color, path: path})
    this.token = token
    this.moveKeysPressed = {
      north: false,
      south: false,
      east: false,
      west: false,
    }
    this.moved = false
    this.speed = 0.2
  }

  updateVelocity() {
    const move = new Vector()
    if (this.moveKeysPressed.north) move.y -= 1
    if (this.moveKeysPressed.south) move.y += 1
    if (this.moveKeysPressed.east) move.x += 1
    if (this.moveKeysPressed.west) move.x -= 1

    const lengthSquared = move.lengthSquared()
    if (lengthSquared === 0) {
      this.velocity = new Vector()
    } else {
      this.velocity = move.scaled(this.speed / Math.sqrt(lengthSquared))
    }
  }

  moveKey(keySymbol: symbol): MoveKey {
    switch (keySymbol) {
      case MOVE_NORTH: return 'north'
      case MOVE_SOUTH: return 'south'
      case MOVE_EAST: return 'east'
      case MOVE_WEST: return 'west'
      default:
        throw new Error(`unknown key symbol ${keySymbol.toString()}`)
    }
  }

  update(dt: number, cmds: Command[]) {
    const { x: lastX, y: lastY } = this.transform.position

    super.update(dt, cmds)
    for (const cmd of cmds) {
      // TODO: Check time

      if (cmd.source === this.token) {
        if ("keydown" in cmd.payload) {
          this.moveKeysPressed[this.moveKey(cmd.payload.keydown)] = true
          this.updateVelocity()
        } else if ("keyup" in cmd.payload) {
          this.moveKeysPressed[this.moveKey(cmd.payload.keyup)] = false
          this.updateVelocity()
        } else if ("setOwnPosition" in cmd.payload) {
          this.transform.position = cmd.payload.setOwnPosition
        } else if ("disconnect" in cmd.payload) {
          return false
        }
      }
    }

    const { x, y } = this.transform.position
    if (x !== lastX || y !== lastY) {
      this.moved = true
    }

    return true
  }
}

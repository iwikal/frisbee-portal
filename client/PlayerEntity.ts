import { GameEntity } from "./gamestate"
import { Transform, Vector } from "../shared/vector";
import { Command, MOVE_NORTH, MOVE_SOUTH, MOVE_EAST, MOVE_WEST } from "./command"

export class PlayerEntity extends GameEntity {
  token: string

  velocity: Vector
  moved: boolean

  constructor(size: number, transform: Transform, color: string, token: string) {
    const path = new Path2D()
    path.arc(0, 0, size / 2, 0, 2 * Math.PI)
    super(new Vector(size, size), transform, {style: () => color, path: path})
    this.token = token
    this.velocity = new Vector(0, 0)
    this.moved = false
  }

  update(dt: number, cmds: Command[]) {
    const { x: lastX, y: lastY } = this.transform.position

    super.update(dt, cmds)
    for (const cmd of cmds) {
      // TODO: Check time

      if (cmd.source === this.token) {
        if ("keydown" in cmd.payload) {
          switch (cmd.payload.keydown) {
            case MOVE_NORTH:
              this.velocity.y = -2
              break
            case MOVE_SOUTH:
              this.velocity.y = 2
              break
            case MOVE_EAST:
              this.velocity.x = 2
              break
            case MOVE_WEST:
              this.velocity.x = -2
              break
          }
        } else if ("keyup" in cmd.payload) {
          switch (cmd.payload.keyup) {
            case MOVE_NORTH:
            case MOVE_SOUTH:
              this.velocity.y = 0
              break
            case MOVE_EAST:
            case MOVE_WEST:
              this.velocity.x = 0
              break
          }
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

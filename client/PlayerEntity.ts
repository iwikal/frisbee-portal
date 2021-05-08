import { GameEntity } from "./gamestate"
import { Transform, Vector } from "../shared/vector";
import { Command, MOVE_NORTH, MOVE_SOUTH, MOVE_EAST, MOVE_WEST } from "./command"

export class PlayerEntity extends GameEntity {
  token: string

  constructor(size: number, transform: Transform, color: string, token: string) {
    const path = new Path2D()
    path.arc(0, 0, size / 2, 0, 2 * Math.PI)
    super(new Vector(size, size), transform, {style: () => color, path: path})
    this.token = token
  }

  update(dt: number, cmds: Command[]) {
    super.update(dt, cmds)
    for (const cmd of cmds) {
      // TODO: Check time
      
      console.log(`${this.token}, ${cmd.source}`)

      if (cmd.source === this.token) {
        if ("keydown" in cmd.payload) {
          console.log(`got keydown event ${cmd.payload.keydown.toString()}`)
          switch (cmd.payload.keydown) {
            case MOVE_NORTH:
              this.transform.position.y -= dt
              break
            case MOVE_SOUTH:
              this.transform.position.y += dt
              break
            case MOVE_EAST:
              this.transform.position.x += dt
              break
            case MOVE_WEST:
              this.transform.position.x -= dt
              break
          }
        } else if ("setOwnPosition" in cmd.payload) {
          this.transform.position = cmd.payload.setOwnPosition
        } else if ("disconnect" in cmd.payload) {
          return false
        }
      }
    }

    return true
  }
}
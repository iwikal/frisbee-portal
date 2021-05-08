import { GameEntity, Vector, Transform } from "./gamestate"
import { Command, MOVE_NORTH, MOVE_SOUTH, MOVE_EAST, MOVE_WEST } from "./command"

export class Player extends GameEntity {
  token: string

  constructor(size: Vector, transform: Transform, token: string = "") {
    super(size, transform, {style: () => 'red'})
    this.token = token
  }

  update(dt: number, cmds: Command[]) {
    super.update(dt, cmds)
    for (const cmd of cmds) {
      // TODO: Check time
      
      if (cmd.source === this.token) {
        if ("keydown" in cmd.payload) {
          switch (cmd.payload.keydown) {
            case MOVE_NORTH:
              this.transform.position.y += 100 * dt
              break
            case MOVE_SOUTH:
              this.transform.position.y -= 100 * dt
              break
            case MOVE_EAST:
              this.transform.position.x += 100 * dt
              break
            case MOVE_WEST:
              this.transform.position.x -= 100 * dt
              break
          }
        }
      }
    }
  }
}
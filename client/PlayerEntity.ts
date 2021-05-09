import { GameEntity } from "./gamestate"
import { Transform, Vector } from "../shared/vector";
import { Command, MOVE_NORTH, MOVE_SOUTH, MOVE_EAST, MOVE_WEST, SPAWN_FRISBEE, THROW_FRISBEE } from "./command"
import { Frisbee } from "./Frisbee";

type MoveKey = 'north' | 'south' | 'east' | 'west'

export class PlayerEntity extends GameEntity {
  token: string

  heldItem : GameEntity | null

  moveKeysPressed: Record<MoveKey, boolean>
  moved: boolean
  speed: number

  constructor(size: number, transform: Transform, color: string, token: string, parent: GameEntity) {
    const path = new Path2D()
    path.arc(0, 0, size / 2, 0, 2 * Math.PI)
    super(new Vector(size, size), transform, {style: () => color, path: path}, parent)
    this.token = token
    this.moveKeysPressed = {
      north: false,
      south: false,
      east: false,
      west: false,
    }
    this.moved = false
    this.speed = 0.2
    this.heldItem = null
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
          switch (cmd.payload.keydown) {
            case SPAWN_FRISBEE:
              if (this.heldItem === null) {
                this.heldItem = new Frisbee(40, new Vector(0, 0), this)
                this.children.push(this.heldItem)
              } else {
                console.log("No, you get one")
              }
              break
            case THROW_FRISBEE:
              if (this.heldItem === null) {
                console.log("Nothing to throw!")
              } else {
                const index = this.children.indexOf(this.heldItem)
                console.log("Yeet!")
                this.heldItem.transform.position = this.heldItem.transform.position.plus(this.transform.position)
                this.heldItem.parent = this.parent
                this.heldItem.velocity = this.velocity.scaled(3)
                this.heldItem = null
              }
              console.log(`Maybe about to throw a frisbee: Has ${this.children.length} child(ren)`)

              const maybeFrisbee = this.children.pop()
              console.log(`Popped a child: ${maybeFrisbee}`)
              if (maybeFrisbee instanceof Frisbee) {
                this.parent.children.push(maybeFrisbee)
                
                
                console.log(this.parent)
              } else if (maybeFrisbee !== undefined) {
                this.children.push(maybeFrisbee)
                console.log("No yeet, pushing it again")
              } else {
                console.log("Oh, it was undefined, nevermind")
              }
              console.log(`${this.children.length} child(ren) remaining`)
              console.log(this.children)
              break
            default:
              this.moveKeysPressed[this.moveKey(cmd.payload.keydown)] = true
              this.updateVelocity()
              break
          }
        } else if ("keyup" in cmd.payload) {
          switch (cmd.payload.keyup) {
            case SPAWN_FRISBEE:
            case THROW_FRISBEE:
              break
            default:
              this.moveKeysPressed[this.moveKey(cmd.payload.keyup)] = false
              this.updateVelocity()
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

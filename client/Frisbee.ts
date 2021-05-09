import { Vector } from "../shared/vector";
import { Collider, ColliderCircle } from "./collision";
import { Command } from "./command";
import { GameEntity, FillStyle } from "./gamestate";
import { PlayerEntity } from "./PlayerEntity";

export class Frisbee extends GameEntity implements Collider {
  collider: Collider

  constructor(size: number, position: Vector, parent: GameEntity) {
    function fillStyle(ctx: CanvasRenderingContext2D) : FillStyle {
      let gradient: FillStyle = ctx.createRadialGradient(
        -size / 2, -size / 2, 0,
        -size / 2, -size / 2, size / 2
      )
      gradient.addColorStop(0.6, '#00ffff')
      gradient.addColorStop(1, '#00bbbb')
      return gradient
    }
    let path: Path2D = new Path2D()
    path.arc(-size / 2, -size / 2, size / 2, 0, 2 * Math.PI)
    super(
      new Vector(size, size),
      {rotation: 0, position: position},
      {style: fillStyle, path: path},
      parent
    )
    this.collider = new ColliderCircle(size / 2)
  }

  farthestPointInDirection(direction: Vector): Vector {
    return this.collider.farthestPointInDirection(direction)
  }

  update(dt: number, cmds: Command[]) {
    super.update(dt, cmds)
    if (false /* I collide with a player */) {
      (undefined as PlayerEntity).children.push(this) // They pick me up
      return false // And my previous parent stops managing me
    } else {
      return true
    }
  }
}
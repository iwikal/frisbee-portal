import { GameEntity } from "./gamestate";
import { Transform, Vector } from "../shared/vector";

export class Wall extends GameEntity {
  constructor(size: Vector, transform: Transform, parent: GameEntity) {
    super(
      size,
      transform,
      {
        style: (ctx) => {
          const g = ctx.createLinearGradient(
            -size.x / 2,
            -size.y / 2,
            size.x,
            -size.y / 2,
          )
          g.addColorStop(0, "black")
          g.addColorStop(1, "red")
          return g
        },
      },
      parent
    )
  }
}

export class World extends GameEntity {
  constructor(size: Vector, parent: GameEntity) {
    super(size, {position: new Vector(0, 0), rotation: 0}, {style: ()=>"#fff"}, parent)
  }
}

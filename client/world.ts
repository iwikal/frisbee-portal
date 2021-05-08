import { GameEntity, Vector, Transform } from "./gamestate";

export class Wall extends GameEntity {

  constructor(size: Vector, transform: Transform) {
    super(size, transform, ["Style", "#222"], ()=>{})
  }
}

export class World extends GameEntity {
  walls: Wall[] = []

  constructor(size: Vector) {
    super(size, {position: new Vector(0, 0), rotation: 0}, ["Style", "#fff"], ()=>{})
  }

  draw(ctx: CanvasRenderingContext2D) {
    super.draw(ctx)
    for (const wall of this.walls) {
      wall.draw(ctx)
    }
  }
}

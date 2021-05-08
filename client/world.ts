import { GameEntity, Vector } from "./gamestate";

export class Wall implements GameEntity {
  transform = { position: new Vector(), rotation: 0 }
  size = new Vector()

  draw(ctx: CanvasRenderingContext2D) {
    const oldTransform = ctx.getTransform()
    const { position, rotation } = this.transform
    ctx.rotate(rotation)
    ctx.translate(position.x, position.y)

    ctx.fillRect(-this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y)

    ctx.setTransform(oldTransform)
  }

  update() {}
}

export class World implements GameEntity {
  walls: Wall[] = []
  transform = { position: new Vector(), rotation: 0 }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#222"
    for (const wall of this.walls) {
      wall.draw(ctx)
    }
  }

  update() {}
}

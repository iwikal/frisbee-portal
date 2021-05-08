import { GraphicalEntity } from "./gamestate";

export class Wall implements GraphicalEntity {
  pos = new DOMPoint()
  angle = 0
  size = new DOMPoint()

  draw(ctx: CanvasRenderingContext2D) {
    const oldTransform = ctx.getTransform()
    ctx.rotate(this.angle)
    ctx.translate(this.pos.x, this.pos.y)

    ctx.fillRect(-this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y)

    ctx.setTransform(oldTransform)
  }
}

export class World implements GraphicalEntity {
  walls: Wall[] = []

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#222"
    for (const wall of this.walls) {
      wall.draw(ctx)
    }
  }
}

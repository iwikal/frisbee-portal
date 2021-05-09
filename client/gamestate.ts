import { Command } from "./command"
import { Vector, Transform } from "../shared/vector"

export type FillStyle = string | CanvasGradient | CanvasPattern

export class GameEntity {
  parent: GameEntity ;
  children: GameEntity[] = []
  velocity: Vector = new Vector(0, 0)

  constructor(
      size: Vector,
      transform: Transform,
      sprite:
          {style: (ctx: CanvasRenderingContext2D) => FillStyle, path?: Path2D}
        | {source: CanvasImageSource},
      parent: GameEntity | null
  ) {
    this.sprite = sprite
    this.transform = transform
    this.size = size
    if (parent === null) {
      this.parent = this
    } else {
      this.parent = parent
    }
  }

  update(deltaTime: number, commands: Command[]): boolean {
    let childrenRemoved = 0
    for (const [index, child] of this.children.entries()) {
      if ( ! child.update(deltaTime, commands) ) {
        console.log(this.children.splice(index - childrenRemoved, 1)[0] === child)
      }
    }

    this.transform.position.x += this.velocity.x * deltaTime
    this.transform.position.y += this.velocity.y * deltaTime

    return true
  }
  draw(canvasContext: CanvasRenderingContext2D) : void {
    const previousTransform = canvasContext.getTransform()
    canvasContext.translate(this.transform.position.x, this.transform.position.y)
    canvasContext.rotate(this.transform.rotation)
    if ("style" in this.sprite) {
      const previousFillStyle = canvasContext.fillStyle
      canvasContext.fillStyle = this.sprite.style(canvasContext)
      if ("path" in this.sprite) {
        canvasContext.fill(this.sprite.path)
      } else {
        canvasContext.fillRect(-this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y)
      }
      canvasContext.fillStyle = previousFillStyle
    } else {
      canvasContext.drawImage(this.sprite.source, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y)
    }

    for (const child of this.children) {
      child.draw(canvasContext)
    }

    canvasContext.setTransform(previousTransform)
  }

  transform: Transform

  size: Vector

  sprite:
      {style: (ctx: CanvasRenderingContext2D) => FillStyle, path? : Path2D}
    | {source: CanvasImageSource}
}
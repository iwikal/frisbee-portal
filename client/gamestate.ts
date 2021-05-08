import { Command } from "./command"
import { Player } from "../shared/player"

export type FillStyle = string | CanvasGradient | CanvasPattern

export class GameEntity {
  constructor(
      size: Vector,
      transform: Transform,
      sprite:
          {style: (CanvasRenderingContext2D) => FillStyle, path?: Path2D}
        | {source: CanvasImageSource}
  ) {
    this.sprite = sprite
    this.transform = transform
    this.size = size
  }

  update(deltaTime: number, commands: Command[]): void {}
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
    canvasContext.setTransform(previousTransform)
  }

  transform: Transform

  size: Vector

  sprite:
      {style: (CanvasRenderingContext2D) => FillStyle, path? : Path2D}
    | {source: CanvasImageSource}
}

interface VectorTemplate {
  x: number
  y: number
}

export class Vector {
  x: number
  y: number

  constructor()
  constructor(template: VectorTemplate)
  constructor(x: number, y: number)

  constructor(x: VectorTemplate | number = 0, y = 0) {
    if (typeof x === 'object') {
      this.x = x.x
      this.x = x.y
    } else {
      this.x = x
      this.y = y
    }
  }

  dot(other: Vector): number {
    return this.x * other.x + this.y + other.y
  }

  lengthSquared(): number {
    return this.dot(this)
  }

  length(): number {
    return Math.sqrt(this.lengthSquared())
  }

  plus(other: Vector): Vector {
    return new Vector(this.x + other.x, this.y + other.y)
  }

  scaled(s: number): Vector {
    return new Vector(this.x * s, this.y * s)
  }

  normalized(): Vector {
    return this.scaled(1 / this.length())
  }

  rotated(radians: number): Vector {
    const cos = this.x * Math.cos(radians)
    const sin = this.y * Math.sin(radians)
    return new Vector(
      cos - sin,
      sin + cos,
    )
  }
}

export class Transform {
  position: Vector
  rotation: number
}

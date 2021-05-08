import { Command } from "./command"

export interface GameEntity {
  draw(canvasContext: CanvasRenderingContext2D) : void
  update(deltaTime: number, commands: Command[]) : void

  transform: Transform

  sprite?: CanvasImageSource
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

export interface Transform {
  position: Vector
  rotation: number
}

import { Command } from "./command"

export type FillStyle = string | CanvasGradient | CanvasPattern

export class GameEntity {
  constructor(
      size: Vector,
      transform: Transform,
      sprite:
          ["Style", FillStyle]
        | ["Source", CanvasImageSource],
      update:
        (
          this: GameEntity,
          deltaTime: number,
          commands: Command[]
        ) => void
  ) {
    this.sprite = sprite
    this.transform = transform
    this.update = update
    console.log(`${this.transform.position.x}x${this.transform.position.y}`)
    this.size = size
  }

  update: (deltaTime: number, commands: Command[]) => void;
  draw(canvasContext: CanvasRenderingContext2D) : void {
    const previousTransform = canvasContext.getTransform()
    canvasContext.translate(this.transform.position.x, this.transform.position.y)
    canvasContext.rotate(this.transform.rotation)
    switch (this.sprite[0]) {
      case "Style":
        //console.log(`Drawing a ${this.size.x}x${this.size.y} object at ${this.transform} using fillstyle ${this.sprite[1]}`)
        const previousFillStyle = canvasContext.fillStyle
        canvasContext.fillStyle = this.sprite[1]
        canvasContext.fillRect(-this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y)
        canvasContext.fillStyle = previousFillStyle
        break;
      case "Source":
        console.log(`Drawing a size-${this.size} object at ${this.transform} using imagesource ${this.sprite[1]}`)
        canvasContext.drawImage(this.sprite[1], 0, 0, this.size.x, this.size.y)
        break;
      default:
        console.log("This should be impossible")
    }
    canvasContext.setTransform(previousTransform)
  }

  transform: Transform

  size: Vector

  sprite: ["Style", FillStyle] | ["Source", CanvasImageSource]
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

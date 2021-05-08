export class Player {
  x: number
  y: number
  lastX: number
  lastY: number
  moved: boolean


  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.lastX = x
    this.lastY = y
    this.moved = false
  }

  update(x: number, y: number): void {
    this.x = x
    this.y = y
  }

  printPosition() : void {
    console.log("Player position " + this.x + ":" + this.y)
  }
}
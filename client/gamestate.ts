import { Command } from "./command"

export interface GameEntity {
  draw(canvasContext: CanvasRenderingContext2D) : void
  update(deltaTime: number, commands: Command[]) : void

  position: Position

  sprite?: CanvasImageSource
}

export interface Position {
  x: number
  y: number
  r: number
}

import { Command } from "./command"
import { Player } from "../shared/player"

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

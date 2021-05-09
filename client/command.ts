import { Vector } from "../shared/vector"

export interface Command {
  time: number
  source: string
  payload: EventPayload
}

export type EventPayload =
  | {keyup: symbol}
  | {keydown: symbol}
  | {setOwnPosition: Vector}
  | {disconnect: {}}

export const MOVE_NORTH = Symbol("north")
export const MOVE_EAST = Symbol("east")
export const MOVE_SOUTH = Symbol("south")
export const MOVE_WEST = Symbol("west")
export const SPAWN_FRISBEE = Symbol("spawn")
export const THROW_FRISBEE = Symbol("throw")

export let keyBindings: Map<symbol, string> = new Map([
  [MOVE_NORTH, "KeyW"],
  [MOVE_SOUTH, "KeyS"],
  [MOVE_EAST, "KeyD"],
  [MOVE_WEST, "KeyA"],
  [SPAWN_FRISBEE, "KeyQ"],
  [THROW_FRISBEE, "KeyE"],
])
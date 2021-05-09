import { Vector } from "../shared/vector"

export interface Command {
  time: number
  source: string
  payload: EventPayload
}

export type EventPayload =
  | {keyup: string}
  | {keydown: string}
  | {setOwnPosition: Vector}
  | {disconnect: {}}

export const MOVE_NORTH = "north"
export const MOVE_EAST = "east"
export const MOVE_SOUTH = "south"
export const MOVE_WEST = "west"

export let keyBindings: Map<string, string> = new Map([
  [MOVE_NORTH, "KeyW"],
  [MOVE_SOUTH, "KeyS"],
  [MOVE_EAST, "KeyD"],
  [MOVE_WEST, "KeyA"]
])
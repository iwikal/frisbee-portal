export interface Command {
    time: number
    source: string
    payload: EventPayload
}

export type EventPayload = {keyup: symbol} | {keydown: symbol}

export const MOVE_NORTH = Symbol()
export const MOVE_EAST = Symbol()
export const MOVE_SOUTH = Symbol()
export const MOVE_WEST = Symbol()

export let keyBindings = {
    [MOVE_NORTH]: "w",
    [MOVE_SOUTH]: "s",
    [MOVE_EAST]: "d",
    [MOVE_WEST]: "a"
}
export class Player {
    x: number
    y: number

    constructor(token: String, x: number, y: number) {
        this.x = x
        this.y = y
    }

    update(x: number, y: number): void {
        this.x = x
        this.y = y
    }

    printPosition() : void {
        console.log("Player position " + this.x + ":" + this.y)
    }

}
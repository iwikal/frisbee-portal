export interface GameEntity {
  draw(canvasContext: CanvasRenderingContext2D) : void;
  update(deltaTime: number) : void;
}
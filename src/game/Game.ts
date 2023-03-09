export class Game {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    constructor(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
    }

    public restart() {
        this.clearCanvas();
    }

    private clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

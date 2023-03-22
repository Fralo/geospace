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

export const Modes = {
    MODE_HANDS: {
        label: 'Hands',
        tag: 'MODE_HANDS',
        keypoints: ["right_wrist", "left_wrist"],
    },
    MODE_NOSE: {
        label: 'Nose',
        tag: 'MODE_NOSE',
        keypoints: ["nose"],
    },
};

export const ModesList = Object.keys(Modes).map(key => Modes[key]);


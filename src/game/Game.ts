export const Modes = {
    MODE_HANDS: {
        label: "Hands",
        tag: "MODE_HANDS",
        keypoints: ["right_wrist", "left_wrist"],
    },
    MODE_NOSE: {
        label: "Nose",
        tag: "MODE_NOSE",
        keypoints: ["nose"],
    },
};

export const ModesList = Object.keys(Modes).map((key) => Modes[key]);

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

    public async canvasLoop() {
        this.ctx.save();

        this.ctx.translate(canvas.width, 0);
        this.ctx.scale(-1, 1);

        const estimationConfig = {
            maxPoses: players,
            flipHorizontal: false,
            scoreThreshold: 0.5,
            nmsRadius: 20,
        };

        let poses = await detector.estimatePoses(canvas, estimationConfig);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

        let circles = [];

        let playersKeypoins = poses.map((pose) => getKeypoints(pose));

        playersKeypoins.sort((a, b) => {
            let minXa = a.reduce((min, keypoint) => {
                return keypoint.x < min ? keypoint.x : min;
            }, Infinity);

            let minXb = b.reduce((min, keypoint) => {
                return keypoint.x < min ? keypoint.x : min;
            }, Infinity);

            return a - b;
        });

        for (let i = 0; i < playersKeypoins.length; i++) {
            const keypoints = playersKeypoins[i];
            keypoints.forEach(({ x, y, score }) => {
                if (score > 0.2) {
                    let circle = new Circle(20);
                    circle.setCoords(canvas.width - x, y);
                    circle.draw(canvas, ctx);
                    circles.push(circle);
                }
            });

            if (gameOn) {
                circles.forEach((circle) => {
                    if (detectCollision(circle, targets[i])) {
                        targets[i].setRandomCoords(
                            canvas,
                            players == 1 ? "ALL" : i == 0 ? "LEFT" : "RIGHT"
                        );
                        playerScore[i]++;
                        if (playersTTFH[i] == null) {
                            let firstPointTime = Date.now();
                            playersTTFH[i] = firstPointTime - gameStartTime;
                        }
                    }
                });
            }
        }

        //draws the taregt
        targets.forEach((target) => target.draw(canvas, ctx));

        ctx.restore();
        requestAnimationFrame(canvasLoop);
    };

}

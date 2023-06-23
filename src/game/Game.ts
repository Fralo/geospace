import * as poseDetection from "@tensorflow-models/pose-detection";
import { Circle, Target, detectCollision } from "./Shapes";

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

const videoWidth = window.innerWidth / 1.2;
const videoHeight = window.innerWidth / 2.8;

export class Game {
    video: HTMLVideoElement;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    detector: any;
    time: number;
    mode: string;
    players: number;
    targets: Target[] = [];
    gameOn: boolean = false;
    playerScore: number[];
    playersTTFH = [];
    gameTimeRemaining: number;
    gameStartTime: number;
    intervalId: NodeJS.Timer;
    terminateCallback: Function;
    showLoadingTimer: boolean = false;
    secondsToWait: number = 3;

    constructor(
        video: HTMLVideoElement,
        canvas: HTMLCanvasElement,
        time: number = 30,
        mode: string = "MODE_NOSE",
        players: number = 1,
        terminateCallback: Function
    ) {
        console.log("Game created", canvas);
        this.video = video;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.time = time;
        this.mode = mode;
        this.players = players;

        this.playerScore = players == 1 ? [0] : [0, 0];

        this.playersTTFH = new Array(players).fill(null);
        this.terminateCallback = terminateCallback;
    }

    public async boot() {
        for (let i = 0; i < this.players; i++) {
            let target = new Target(i > 0 ? "green" : "blue");
            target.setRandomRawCoords(
                {
                    width: videoWidth,
                    height: videoHeight,
                },
                this.players == 1 ? "ALL" : i == 0 ? "LEFT" : "RIGHT"
            );

            this.targets.push(target);
        }

        this.startLoadingTimer();
    }
    public restart() {
        this.clearCanvas();
    }

    private clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public async canvasLoop() {
        this.context.save();

        this.context.translate(this.canvas.width, 0);
        this.context.scale(-1, 1);

        const estimationConfig = {
            maxPoses: this.players,
            flipHorizontal: false,
            scoreThreshold: 0.5,
            nmsRadius: 20,
        };

        let poses = await this.detector.estimatePoses(
            this.canvas,
            estimationConfig
        );

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.drawImage(this.video, 0, 0, videoWidth, videoHeight);

        let circles = [];

        let playersKeypoins = poses.map((pose) => this.getKeypoints(pose));

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
                    circle.setCoords(this.canvas.width - x, y);
                    circle.draw(this.canvas, this.context);
                    circles.push(circle);
                }
            });

            if (this.gameOn) {
                circles.forEach((circle) => {
                    if (detectCollision(circle, this.targets[i])) {
                        this.targets[i].setRandomCoords(
                            this.canvas,
                            this.players == 1
                                ? "ALL"
                                : i == 0
                                ? "LEFT"
                                : "RIGHT"
                        );
                        this.playerScore[i]++;
                        if (this.playersTTFH[i] == null) {
                            let firstPointTime = Date.now();
                            this.playersTTFH[i] =
                                firstPointTime - this.gameStartTime;
                        }
                    }
                });
            }
        }

        //draws the taregt
        this.targets.forEach((target) =>
            target.draw(this.canvas, this.context)
        );

        this.context.restore();
        requestAnimationFrame(this.canvasLoop);
    }

    public getKeypoints(pose) {
        if (pose == null) return [];
        let allKeypoints = pose.keypoints;

        return allKeypoints.filter((keypoint) => {
            return ModesList[this.mode].includes(keypoint.name);
        });
    }

    public async initializePosenet() {
        const detectorConfig = {
            modelType:
                this.players === 1
                    ? poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
                    : poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
        };
        const model = poseDetection.SupportedModels.MoveNet;
        this.detector = await poseDetection.createDetector(
            model,
            detectorConfig
        );
    }

    public async setupCamera() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error(
                "Browser API navigator.mediaDevices.getUserMedia not available"
            );
        }

        this.video.width = videoWidth;
        this.video.height = videoHeight;

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                facingMode: "user",
                width: videoWidth,
                height: videoHeight,
            },
        });

        this.video.srcObject = stream;
        this.video.onloadedmetadata = () => {
            this.video.play();
        };

        this.setupCanvas();
    }

    public setupCanvas() {
        for (let i = 0; i < this.targets.length; i++) {
            const target = this.targets[i];
            target.setRandomCoords(
                this.canvas,
                this.players == 1 ? "ALL" : i == 0 ? "LEFT" : "RIGHT"
            );
        }
        this.canvasLoop();
    }

    public startGame() {
        this.gameOn = true;
        this.gameTimeRemaining = this.time;
        this.gameStartTime = Date.now();
        this.startCountdown();
    }

    public startLoadingTimer() {
        this.showLoadingTimer = true;
        this.secondsToWait = 3;
        let timeInterval = setInterval(() => {
            if (this.secondsToWait === 1) {
                clearInterval(timeInterval);
                this.showLoadingTimer = false;
                this.startGame();
                return;
            }
            this.secondsToWait--;
        }, 1000);
    }

    public startCountdown() {
        // Set up interval to update time remaining every second
        this.intervalId = setInterval(() => {
            this.gameTimeRemaining--;
            if (this.gameTimeRemaining === 0) {
                console.debug("time ended");
                this.gameOn = false;
                clearInterval(this.intervalId);

                let results = [];
                for (let i = 0; i < this.players; i++) {
                    results.push({
                        score: this.playerScore[i],
                        time: this.time,
                        ttfh: this.playersTTFH[i],
                    });
                }

                console.debug("game ended");
                this.terminateCallback(results);
            }
        }, 1000);
    }
}

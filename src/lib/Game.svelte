<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    import { onMount } from "svelte";
    import "@tensorflow/tfjs";
    import * as poseDetection from "@tensorflow-models/pose-detection";
    import { Circle, detectCollision, Target } from "../game/Shapes";

    let video = null;
    let canvas: HTMLCanvasElement = null;
    let ctx: CanvasRenderingContext2D = null;
    let detector = null;

    let showLoadingTimer = null;
    let secondsToWait = null;

    let gameOn = false;
    let gameTimeRemaining = null;

    let gameStartTime = null;
    let playerOneTTFH = null;

    const drawVideo = true;

    const MODES = {
        MODE_HANDS: ["right_wrist", "left_wrist"],
        MODE_NOSE: ["nose"],
    };

    export let mode = "MODE_NOSE";
    export let time = 60;
    export let players = 2;

    const videoWidth = window.innerWidth / 2;
    const videoHeight = window.innerWidth / 2.8;

    let target = new Target();
    let score = 0;

    const setupCamera = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error(
                "Browser API navigator.mediaDevices.getUserMedia not available"
            );
        }

        video.width = videoWidth;
        video.height = videoHeight;

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                facingMode: "user",
                width: videoWidth,
                height: videoHeight,
            },
        });

        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();
        };

        setupCanvas();
    };

    const setupCanvas = () => {
        target.setRandomCoords(canvas);
        canvasLoop();
    };

    const canvasLoop = async () => {
        ctx.save();

        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);

        const estimationConfig = {
            maxPoses: players,
            flipHorizontal: false,
            scoreThreshold: 0.5,
            nmsRadius: 20,
        };

        const poses = await detector.estimatePoses(canvas, estimationConfig);

        console.log(poses)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

        let circles = [];

        for (const pose of poses) {
            let keypoints = getKeypoints(pose);
            keypoints.forEach(({ x, y, score }) => {
                if (score > 0.2) {
                    let circle = new Circle(20);
                    circle.setCoords(canvas.width - x, y);
                    circle.draw(canvas, ctx);
                    circles.push(circle);
                }
            });

            if (gameOn) {
                target.draw(canvas, ctx);

                circles.forEach((circle) => {
                    if (detectCollision(circle, target)) {
                        target.setRandomCoords(canvas);
                        score++;
                        if (playerOneTTFH === null) {
                            let firstPointTime = Date.now();
                            playerOneTTFH = firstPointTime - gameStartTime;
                        }
                    }
                });
            }
        }

        ctx.restore();
        requestAnimationFrame(canvasLoop);
    };

    const getKeypoints = (pose) => {
        if (pose == null) return [];
        let allKeypoints = pose.keypoints;

        return allKeypoints.filter((keypoint) => {
            return MODES[mode].includes(keypoint.name);
        });
    };

    const initializePosenet = async () => {
        const detectorConfig = {
            modelType: players === 1 ?poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING : poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
        };
        const model = poseDetection.SupportedModels.MoveNet;
        detector = await poseDetection.createDetector(model, detectorConfig);
    };

    const startLoadingTimer = () => {
        showLoadingTimer = true;
        secondsToWait = 3;
        let timeInterval = setInterval(() => {
            if (secondsToWait === 1) {
                clearInterval(timeInterval);
                showLoadingTimer = false;
                startGame();
                return;
            }
            secondsToWait--;
        }, 1000);
    };

    let intervalId = null; // Store interval ID so we can stop the countdown later

    function startCountdown() {
        // Set up interval to update time remaining every second
        intervalId = setInterval(() => {
            gameTimeRemaining--;
            if (gameTimeRemaining === 0) {
                gameOn = false;
                clearInterval(intervalId);
                dispatch("gameEnded", { score, time, ttfh: playerOneTTFH });
            }
        }, 1000);
    }

    const startGame = () => {
        gameOn = true;
        gameTimeRemaining = time;
        gameStartTime = Date.now();
        startCountdown();
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;

        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    onMount(async () => {
        video = document.getElementById("video") as HTMLVideoElement;
        canvas = document.getElementById("canvas") as HTMLCanvasElement;

        canvas.width = videoWidth;
        canvas.height = videoHeight;
        ctx = canvas.getContext("2d");

        await initializePosenet();

        setupCamera();

        startLoadingTimer();
    });
</script>

<div class="h-full min-h-[80vh] relative">
    {#if showLoadingTimer}
        <div
            class="bg-opacity-80 bg-black top-0 left-0 absolute w-full h-full text-6xl flex items-center justify-center"
        >
            {secondsToWait}
        </div>
    {/if}
    <div class="h-full flex flex-col items-center justify-around text-white">
        <video class="hidden" id="video" playsinline>
            Video stream not available.
        </video>
        <canvas id="canvas" />
        {#if gameOn}
            <div class="flex gap-2 items-center">
                <div class="text-4xl text-center">
                    Tempo rimanente: {formatTime(gameTimeRemaining)}
                </div>
                <div class="text-4xl text-center">
                    Punteggio: {score}
                </div>
            </div>
        {/if}
    </div>
</div>

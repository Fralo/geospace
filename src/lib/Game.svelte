<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    import { onMount } from "svelte";
    import "@tensorflow/tfjs";
    import * as poseDetection from "@tensorflow-models/pose-detection";
    import { Circle, detectCollision, Target } from "../game/Shapes";
    import PlayerCounter from "./game-stats/PlayerCounter.svelte";

    let video = null;
    let canvas: HTMLCanvasElement = null;
    let ctx: CanvasRenderingContext2D = null;
    let detector = null;

    let showLoadingTimer = null;
    let secondsToWait = null;

    let gameOn = false;
    let gameTimeRemaining = null;

    let gameStartTime = null;
    let playersTTFH = [];

    const drawVideo = true;

    const MODES = {
        MODE_HANDS: ["right_wrist", "left_wrist"],
        MODE_NOSE: ["nose"],
    };

    export let mode = "MODE_NOSE";
    export let time = 60;
    export let players = 1;

    const videoWidth = window.innerWidth / 1.6;
    const videoHeight = window.innerWidth / 2.8;

    let targets: Target[] = [];

    const initTargets = () => {
        for (let i = 0; i < players; i++) {
            let target = new Target(i > 0 ? "green" : "blue");
            target.setRandomRawCoords(
                {
                    width: videoWidth,
                    height: videoHeight,
                },
                players == 1 ? "ALL" : i == 0 ? "LEFT" : "RIGHT"
            );

            targets.push(target);
        }
    };

    initTargets();

    let playerScore = players == 1 ? [0] : [0, 0];

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
        for (let i = 0; i < targets.length; i++) {
            const target = targets[i];
            target.setRandomCoords(
                canvas,
                players == 1 ? "ALL" : i == 0 ? "LEFT" : "RIGHT"
            );
        }
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

            return minXa - minXb;
        });

        for (let i = 0; i < playersKeypoins.length; i++) {
            const keypoints = playersKeypoins[i];
            keypoints.forEach(({ x, y, score }) => {
                let circle = new Circle(20);
                circle.setCoords(canvas.width - x, y);
                circle.draw(canvas, ctx);
                circles.push(circle);
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

    const getKeypoints = (pose) => {
        if (pose == null) return [];
        let allKeypoints = pose.keypoints;

        return allKeypoints.filter((keypoint) => {
            return MODES[mode].includes(keypoint.name);
        });
    };

    const initializePosenet = async () => {
        const detectorConfig = {
            modelType:
                players === 1
                    ? poseDetection.movenet.modelType.SINGLEPOSE_THUNDER
                    : poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
            minPoseScore: 0.2,
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
                console.debug("time ended");
                gameOn = false;
                clearInterval(intervalId);

                let results = [];
                for (let i = 0; i < players; i++) {
                    results.push({
                        score: playerScore[i],
                        time,
                        ttfh: playersTTFH[i],
                    });
                }
                dispatch("gameEnded", results);
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

        playersTTFH = new Array(players).fill(null);
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
    <div class="h-full flex items-center justify-around text-white">
        <div>
            <video class="hidden" id="video" playsinline>
                Video stream not available.
            </video>
            <canvas id="canvas" />
            {#if gameOn}
                <div class="mt-8 flex flex-col gap-4 items-center">
                    <div class="text-4xl text-center">
                        Time left: {formatTime(gameTimeRemaining)}
                    </div>
                    {#if players === 1}
                        <div class="text-4xl text-center">
                            Score: {playerScore[0]}
                        </div>
                    {/if}
                </div>
                {#if players == 2}
                    {#each playerScore as score, i}
                        <PlayerCounter
                            displayName={`Player ${i + 1}`}
                            {score}
                        />
                    {/each}
                {/if}
            {/if}
        </div>
    </div>
</div>

<script lang="ts">
    import { onMount } from "svelte";
    import "@tensorflow/tfjs";
    import * as poseDetection from "@tensorflow-models/pose-detection";
    import { Circle, detectCollision, Target } from "./game/Shapes";

    let video = null;
    let canvas: HTMLCanvasElement = null;
    let ctx: CanvasRenderingContext2D = null;
    let detector = null;

    const drawVideo = true;

    const MODES = {
        MODE_HANDS: ["right_wrist", "left_wrist"],
        MODE_NOSE: ["nose"],
    };

    const selectedMode = "MODE_NOSE";

    const videoWidth = window.innerWidth / 2.8;
    const videoHeight = window.innerWidth / 2.8;

    let target = new Target();
    let score = 0;

    const setupCamera = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error(
                "Browser API navigator.mediaDevices.getUserMedia not available"
            );
        }

        console.log(videoWidth, videoHeight);
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
            maxPoses: 1,
            flipHorizontal: false,
            scoreThreshold: 0.5,
            nmsRadius: 20,
        };

        const poses = await detector.estimatePoses(canvas, estimationConfig);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

        let circles = [];

        let keypoints = getKeypoints(poses);
        keypoints.forEach(({ x, y, score }) => {
            if (score > 0.2) {
                let circle = new Circle(20);
                circle.setCoords(canvas.width - x, y);
                circle.draw(canvas, ctx);
                circles.push(circle);
            }
        });

        target.draw(canvas, ctx);

        circles.forEach((circle) => {
            if (detectCollision(circle, target)) {
                target.setRandomCoords(canvas);
                score++;
            }
        });

        ctx.restore();
        requestAnimationFrame(canvasLoop);
    };

    const getKeypoints = (poses) => {
        if (!poses || !poses.length) return [];
        let allKeypoints = poses[0].keypoints;

        return allKeypoints.filter((keypoint) => {
            return MODES[selectedMode].includes(keypoint.name);
        });
    };

    const initializePosenet = async () => {
        const detectorConfig = {
            modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        };
        const model = poseDetection.SupportedModels.MoveNet;
        detector = await poseDetection.createDetector(model, detectorConfig);
    };

    onMount(async () => {
        video = document.getElementById("video") as HTMLVideoElement;
        canvas = document.getElementById("canvas") as HTMLCanvasElement;

        canvas.width = videoWidth;
        canvas.height = videoHeight;
        ctx = canvas.getContext("2d");

        await initializePosenet();

        setupCamera();
    });
</script>

<div class="bg-blue-300 h-[100vh] flex items-center justify-around text-white">
    <video class="hidden" id="video" playsinline>
        Video stream not available.
    </video>
    <canvas id="canvas" />
    <div class="text-6xl text-left">
        Punteggio: {score}
    </div>
</div>

<script lang="ts">
    import { onMount } from "svelte";
    import * as poseDetection from "@tensorflow-models/pose-detection";

    import Game from "./lib/Game.svelte";

    let video = null;
    let canvas: HTMLCanvasElement = null;
    let ctx: CanvasRenderingContext2D = null;

    const videoWidth = window.innerWidth / 2.8;
    const videoHeight = window.innerWidth / 2.8;

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

        setupCanvas(video);
    };

    const setupCanvas = (video: HTMLVideoElement) => {
        canvasLoop();
    };

    const canvasLoop = async () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);

        const model = poseDetection.SupportedModels.MoveNet;
        const detector = await poseDetection.createDetector(model);

        const poses = await detector.estimatePoses(video);
        console.log(poses);

        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
        ctx.restore();
        requestAnimationFrame(canvasLoop);
    };

    onMount(async () => {
        video = document.getElementById("video") as HTMLVideoElement;

        canvas = document.getElementById("canvas") as HTMLCanvasElement;
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        ctx = canvas.getContext("2d");

        setupCamera();
    });
</script>

<div class="bg-blue-300 h-[100vh] flex items-center justify-around text-white">
    <video class="hidden" id="video" playsinline>
        Video stream not available.
    </video>
    <canvas id="canvas" />
</div>

import "./app.css";
import App from "./App.svelte";

import "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";

const app = new App({
    target: document.getElementById("app"),
});

export default app;

<script lang="ts">
    import Router from "svelte-spa-router";
    import Home from "./routes/Home.svelte";
    import NotFoundView from "./routes/NotFoundView.svelte";
    import Tutorial from "./routes/Tutorial.svelte";

    import "@tensorflow/tfjs";
    import * as poseDetection from "@tensorflow-models/pose-detection";

    const routes = {
        "/": Home,
        "/training": Tutorial,
        "*": NotFoundView,
    };
</script>

<div>
    <Router {routes} />
</div>

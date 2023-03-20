<script lang="ts">
    import Router from "svelte-spa-router";
    import Home from "./routes/Home.svelte";
    import NotFoundView from "./routes/NotFoundView.svelte";
    import Tutorial from "./routes/Tutorial.svelte";
    import Play from "./routes/Play.svelte";
    import Navbar from "./lib/common/Navbar.svelte";

    import "@tensorflow/tfjs";
    import Rules from "./routes/Rules.svelte";

    const routes = {
        "/": Home,
        "/rules": Rules,
        "/play": Play,
        "/training": Tutorial,
        "*": NotFoundView,
    };
</script>

<div class="text-white min-h-screen bg-gray-900">
    <Navbar />
    <Router {routes} />
</div>

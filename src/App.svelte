<script lang="ts">
    import Router from "svelte-spa-router";
    import Navbar from "./lib/common/Navbar.svelte";

    import { routes } from "./routes";
</script>

<svelte:head>
    <title>Geospace</title>
</svelte:head>

<div class="text-white min-h-screen bg-gray-900">
    <Navbar />
    <Router {routes} />
</div>

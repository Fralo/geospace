<script lang="ts">
    import Router from "svelte-spa-router";
    import Navbar from "./lib/common/Navbar.svelte";

    import { routes } from "./routes";
</script>

<div class="text-white min-h-screen bg-gray-900">
    <Navbar />
    <Router {routes} />
</div>

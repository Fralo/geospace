<script>
    import Button from "../lib/common/Button.svelte";
</script>

<div class="mt-10 h-full">
    <div class="px-4 flex flex-col items-center min-h-[70vh] justify-center gap-6">
        <h1 class="text-5xl font-bold">GEOSPACE</h1>
        <div class="max-w-3xl text-center">
            Geospace is an addictive web-game of reflexes that tests players'
            speed and skill.
        </div>

        <Button
            type="primary"
            on:click={() => (window.location.href = "#/play")}>PLAY</Button
        >
    </div>
</div>

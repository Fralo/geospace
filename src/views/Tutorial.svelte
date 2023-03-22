<script>
    import Game from "../lib/Game.svelte";
    import Setup from "../lib/training/Setup.svelte";

    let page = "setup";
    let gameConfig = {};

    const startTraining = (data) => {
        gameConfig = data.detail;
        console.log(gameConfig)
        page = "training";
    };

</script>

<div>
    {#if page === "setup"}
        <Setup on:startTraining={startTraining} />
    {/if}

    {#if page === "training"}
        <Game mode={gameConfig.mode} />
    {/if}
</div>

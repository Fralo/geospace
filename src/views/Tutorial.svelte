<script>
    import Button from "../lib/common/Button.svelte";
    import Game from "../lib/Game.svelte";
    import GameStats from "../lib/GameStats.svelte";
    import Setup from "../lib/training/Setup.svelte";

    let page = "setup";
    let gameConfig = {};
    let results = {
        score: 3,
        time: 10,
        ttfh: 12,
    };

    const startTraining = (data) => {
        gameConfig = data.detail;
        page = "training";
    };

    const gameEnded = (data) => {
        results = data.detail;
        page = "gameEnding";
    };
</script>

<div>
    {#if page === "setup"}
        <Setup on:startTraining={startTraining} />
    {/if}

    {#if page === "training"}
        <Game
            mode={gameConfig.mode}
            time={gameConfig.time}
            players={gameConfig.playersNum}
            on:gameEnded={gameEnded}
        />
    {/if}

    {#if page === "gameEnding"}
        <GameStats stats={results} players={1} />
        <Button on:click={() => (page = "setup")}>Ricomincia</Button>
    {/if}
</div>

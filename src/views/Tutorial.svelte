<script>
    import Button from "../lib/common/Button.svelte";
    import Game from "../lib/Game.svelte";
    import GameStats from "../lib/GameStats.svelte";
    import Setup from "../lib/training/Setup.svelte";

    let page = "gameEnding";
    let gameConfig = {};
    let results = [
        {
            score: 2,
            time: 12,
            ttfh: 12,
        },
        {
            score: 3,
            time: 12,
            ttfh: 15,
        },
    ];

    const startTraining = (data) => {
        gameConfig = data.detail;
        page = "training";
    };

    const gameEnded = (data) => {
        results = data.detail;
        console.log(results);
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
        <GameStats stats={results} />
        <Button on:click={() => (page = "setup")}>Ricomincia</Button>
    {/if}
</div>

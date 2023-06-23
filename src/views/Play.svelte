<script lang="ts">
    import Button from "../lib/common/Button.svelte";
    import RetryIcon from "../lib/common/icons/RetryIcon.svelte";
    import Game from "../lib/Game.svelte";
    import GameStats from "../lib/GameStats.svelte";
    import Setup from "../lib/training/Setup.svelte";

    let page = "setup";
    let gameConfig = {
        mode: "MODE_NOSE",
        time: 60,
        playersNum: 1,
    };

    let results = [];

    const startGame = (data) => {
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
        <Setup on:startGame={startGame} />
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
        <div class="mt-10 flex justify-center">
            <Button on:click={() => (page = "setup")}>
                <span class="flex items-center gap-2">
                    Play Again <RetryIcon width={14} height={14}/>
                </span>
            </Button>
        </div>
    {/if}
</div>

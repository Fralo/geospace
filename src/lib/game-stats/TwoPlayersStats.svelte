<script lang="ts">
    import OnePlayerGameStats from "./OnePlayerGameStats.svelte";

    export let stats = [];

    let winner =
        stats[0].score > stats[1].score
            ? -1
            : stats[0].score === stats[1].score
            ? 0
            : 1;

    let winnerLabel = "";
    switch (true) {
        case winner === -1:
            winnerLabel = "Player 1";
            break;
        case winner === 0:
            winnerLabel = "Nobody";
            break;
        case winner === 1:
            winnerLabel = "Player 2";
            break;
    }
</script>

<div class="w-full flex items-center justify-center">
    <div>
        <div>
            <h3>Results:</h3>
            <h1>{winnerLabel} wins !</h1>
        </div>

        <div>Here are some statistics about the game</div>

        <div class="mt-10 grid grid-cols-2 gap-10">
            <OnePlayerGameStats
                customClass="col-span-1"
                title="Player 1 Stats"
                stats={stats[0]}
                winning={winner === -1}
            />
            <OnePlayerGameStats
                customClass="col-span-1"
                title="Player 2 Stats"
                stats={stats[1]}
                winning={winner === 1}
            />
        </div>
    </div>
</div>

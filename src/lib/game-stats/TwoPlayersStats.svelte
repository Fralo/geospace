<script lang="ts">
    import OnePlayerGameStats from "./OnePlayerGameStats.svelte";

    export let stats = [];


    let winner =
        stats[0].score > stats[1].score
            ? "Player 1"
            : stats[0].score === stats[1].score
            ? "Nobody"
            : "Player 2";
</script>

<div class="w-full flex items-center justify-center">
    <div>
        <div>
            <h3>Results:</h3>
            <h1>{winner} wins !</h1>
        </div>

        <div>Here are some statistics about the game</div>

        <div class="mt-10 flex gap-10">

            <OnePlayerGameStats title="Player 1 Stats" stats={stats[0]} />
            <OnePlayerGameStats title="Player 2 Stats" stats={stats[1]} />
        </div>
    </div>
</div>

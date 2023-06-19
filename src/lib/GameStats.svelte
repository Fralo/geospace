<script lang="ts">
    import OnePlayerGameStats from "./game-stats/OnePlayerGameStats.svelte";
    import TwoPlayersStats from "./game-stats/TwoPlayersStats.svelte";

    export let stats = [];
</script>

<div class="flex flex-col items-center">
    {#if stats?.length === 1}
        <div>
            <OnePlayerGameStats stats={stats[0]} />
        </div>
    {/if}
    {#if stats?.length === 2}
        <TwoPlayersStats {stats} />
    {/if}
</div>

<script lang="ts">
    import OnePlayerGameStats from "./game-stats/OnePlayerGameStats.svelte";

    export let stats = null;
    export let players = 1;
</script>

<div class="flex flex-col items-center">
    {#if players === 1}
        <div>
            <OnePlayerGameStats {stats} />
        </div>
    {/if}
</div>

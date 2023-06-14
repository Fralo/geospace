<script lang="ts">
    import TrophyCupIcon from "../common/icons/TrophyCupIcon.svelte";

    export let winning = false;
    export let title = "STATS";
    export let stats = {
        score: 0,
        time: 1,
        ttfh: 0,
    };

    let formattedStats = {
        score: stats.score,
        time: stats.time,
        mediumSpeed: stats.score / stats.time,
        ttfh: stats.ttfh,
    };

    let toShowStats = [
        {
            label: "Score",
            value: formattedStats.score,
        },
        {
            label: "Time",
            value: `${formattedStats.time} seconds`,
        },
        {
            label: "Medium speed",
            value: `${formattedStats.mediumSpeed} hits/second`,
        },
        {
            label: "TTFH (Time To First Hit)",
            value: formattedStats.ttfh ? `${formattedStats.ttfh} milliseconds` : 'N/A',
        },
    ];
</script>

<div class="border border-white py-4 rounded-3xl w-fit">
    <div
        class="border-b border-white text-center font-bold tracking-widest text-4xl pb-4"
    >
        {#if !winning}
            <TrophyCupIcon fill="white"/>
        {/if}
        <p>
            {title}
        </p>
    </div>
    {#each toShowStats as stat}
        <div class="mx-4 border-b border-white last:border-b-0">
            <div class="p-2 text-2xl">{stat.label}:</div>
            <div class="p-2 text-4xl">{stat.value}</div>
        </div>
    {/each}
</div>

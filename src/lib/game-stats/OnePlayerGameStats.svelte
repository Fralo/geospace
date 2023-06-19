<script lang="ts">
    import InfoIcon from "../common/icons/InfoIcon.svelte";
    import TrophyCupIcon from "../common/icons/TrophyCupIcon.svelte";

    export let winning = false;
    export let title = "STATS";
    export let stats = {
        score: 0,
        time: 1,
        ttfh: 0,
    };

    export let customClass = null;

    let formattedStats = {
        score: stats.score,
        mediumSpeed: stats.score / stats.time,
        ttfh: stats.ttfh,
    };

    let toShowStats = [
        {
            label: "Score",
            value: formattedStats.score,
        },
        {
            label: "Medium speed",
            value: `${new Intl.NumberFormat("en-IN", {
                maximumSignificantDigits: 2,
            }).format(formattedStats.mediumSpeed)} hits/second`,
        },
        {
            label: "TTFH",
            info: "Time to first hit",
            value: formattedStats.ttfh
                ? `${formattedStats.ttfh} milliseconds`
                : "N/A",
        },
    ];
</script>

<div
    class={`relative border border-white py-4 rounded-3xl max-w-lg ${
        customClass || ""
    }`}
>
    {#if winning}
        <div class="absolute -top-5 -left-5">
            <TrophyCupIcon width={44} height={44} fill="white" />
        </div>
    {/if}
    <div
        class="border-b border-white text-center font-bold tracking-widest text-4xl pb-4"
    >
        <p>
            {title}
        </p>
    </div>
    {#each toShowStats as stat, index}
        <div
            class={`mx-4 border-b border-white last:border-b-0 ${
                index === 0 ? "flex gap-3 items-center" : ""
            }`}
        >
            <div class="flex items-center cursor-pointer gap-2 p-2 text-2xl">
                <span
                    >{stat.label}: {#if stat.info}
                        <span>({stat.info})</span>
                    {/if}
                </span>
            </div>
            <div class="p-2 text-4xl">{stat.value}</div>
        </div>
    {/each}
</div>

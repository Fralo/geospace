<script lang="ts">
    export let displayName = "SCORE";
    export let score = 0;
</script>

<div class="w-[150px] border-white rounded-3xl text-white">
    <h3 class="text-2xl font-bold">{displayName}</h3>
    <div class="w-full h-1 bg-white" />
    <h2>{score}</h2>
</div>

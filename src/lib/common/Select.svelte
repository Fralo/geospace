<script lang="ts">
    export let value = 1;
    export let selectOptions = [];
</script>

<select class="bg-gray-900 border border-white px-2 py-1 rounded-lg" bind:value>
    {#each selectOptions as option}
        <option value={option.value}>{option.label}</option>
    {/each}
</select>

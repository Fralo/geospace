<script lang="ts">
    export let value = 0;
</script>

<input
    class="bg-gray-900 border border-white px-2 py-1 rounded-lg"
    type="number"
    min="1"
    max="999"
    bind:value
/>

<script lang="ts">
    export let href: string;
    export let active: boolean;
</script>

<li>
    <a {href} class="text-gray-400 hover:text-white hover:font-semibold transition-all" class:text-white={active}>
        <slot />
    </a>
</li>

<script lang="ts">
    export let type = "primary";
    export let otherClasses = "";

    let classes =
        `px-5 py-3 text-base font-medium rounded-md active:translate-y-[1px] transition-all ${otherClasses}`;

    switch (type) {
        case "secondary":
            classes = `${classes} text-white`;
            break;
        case "primary":
        default:
            classes = `${classes} bg-white text-gray-900 hover:bg-gray-200`;
    }
</script>

<button class={classes} on:click>
    <slot />
</button>

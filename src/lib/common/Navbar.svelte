<script>
    import { location } from "svelte-spa-router";
    import GithubButton from "./navbar/GithubButton.svelte";
    import NavLink from "./navbar/NavLink.svelte";

    const links = [
        {
            href: "/",
            text: "Home",
        },
        {
            href: "/rules",
            text: "Rules",
        },
        {
            href: "/play",
            text: "Play",
        },
    ];
</script>

<div
    class="h-24 flex justify-between items-center px-8 border-b border-gray-800"
>
    <a class="hidden sm:block" href="#/">
        <h3
            class="font-semibold tracking-[3px] w-[150px] hover:font-bold transition-all"
        >
            GEOSPACE
        </h3>
    </a>

    <nav>
        <ul class="flex gap-10">
            {#each links as link}
                <NavLink href={`#${link.href}`} active={link.href === $location}
                    >{link.text}</NavLink
                >
            {/each}
        </ul>
    </nav>

    <div class="w-[150px] flex justify-end">
        <GithubButton />
    </div>
</div>

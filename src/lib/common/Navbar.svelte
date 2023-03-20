<script>
    import GithubButton from "./GithubButton.svelte";
</script>

<div
    class="h-24 flex justify-between items-center px-8 border-b border-gray-800 "
>
    <h3 class="font-semibold tracking-[3px] w-[150px]">GEOSPACE</h3>

    <nav>
        <ul class="flex gap-10">
            <li>
                <a href="#" class="text-gray-400 hover:text-white">Home</a>
            </li>
            <li>
                <a href="#" class="text-gray-400 hover:text-white">Rules</a>
            </li>
            <li>
                <a href="#" class="text-gray-400 hover:text-white">Play</a>
            </li>
            <li>
                <a href="#" class="text-gray-400 hover:text-white">Training</a>
            </li>
        </ul>
    </nav>

    <div class="w-[150px] flex justify-end">
        <GithubButton />
    </div>
</div>

<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    import Button from "../common/Button.svelte";
    import NumberInput from "../common/NumberInput.svelte";
    import Select from "../common/Select.svelte";

    import { ModesList } from "../../game/Game";

    const modes = ModesList.map((mode) => {
        return {
            value: mode.tag,
            label: mode.label,
        };
    });

    const playesOption = [
        {
            value: 1,
            label: "One",
        },
        {
            value: 2,
            label: "Two",
        },
    ];

    const timeUnits = [
        {
            value: 1,
            label: "Seconds",
        },
        {
            value: 60,
            label: "Minutes",
        },
    ];

    let time = 30;
    let mode = modes[0].value;
    let timeMultilpier = 1;
    let playersNum = 1;

    const startTraining = () => {
        dispatch("startTraining", {
            mode,
            time: time * timeMultilpier,
            playersNum,
        });
    };
</script>

<div class="mt-28 h-full flex justify-center items-center">
    <div class="min-w-[450px] p-6 py-10 border-2 border-white rounded-3xl">
        <div>
            <h1 class="text-4xl font-bold">SETUP</h1>
            <h3 class="text-2xl font-semibold">
                Choose the game settings
            </h3>
        </div>

        <div class="mt-8 flex flex-col gap-4">
            <div class="flex items-center gap-2">
                <span>Select the time:</span>
                <NumberInput bind:value={time} />
                <Select bind:value={timeMultilpier} selectOptions={timeUnits} />
            </div>
            <div class="flex items-center gap-2">
                <span>Select the game mode:</span>
                <Select bind:value={mode} selectOptions={modes} />
            </div>
            <div class="flex items-center gap-2">
                <span>Select the number of players</span>
                <Select bind:value={playersNum} selectOptions={playesOption} />
            </div>
        </div>
        <div class="mt-20 flex justify-center">
            <Button otherClasses="w-full" on:click={startTraining}
                >Start</Button
            >
        </div>
    </div>
</div>

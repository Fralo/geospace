<script>
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

<div>
    <h2>Seleziona le impostazioni di allenamento</h2>

    <div>
        <div>
            <span>Seleziona il tempo: </span>
            <NumberInput bind:value={time} />
            <Select bind:value={timeMultilpier} selectOptions={timeUnits} />
        </div>
        <div>
            <span>Seleziona la modalità di gioco</span>
            <Select bind:value={mode} selectOptions={modes} />
        </div>
        <div>
            <span>Seleziona il numero di giocatori</span>
            <Select bind:value={playersNum} selectOptions={playesOption} />
        </div>
    </div>

    <Button on:click={startTraining}>Avvia</Button>
</div>

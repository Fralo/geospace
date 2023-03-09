<script lang="ts">
    import { onMount } from "svelte";

    export let width = 800;
    export let height = 600;



    let canvas: HTMLCanvasElement;
    let gl: CanvasRenderingContext2D;

    function repeatOften() {
        // Do whatever
        requestAnimationFrame(repeatOften);
    }

    onMount(() => {
        canvas = document.getElementById("game") as HTMLCanvasElement;
        gl = canvas.getContext("2d");

        requestAnimationFrame(repeatOften);
        drwaRect(100, 100, 50, 50);
    });

    const drwaRect = (x, y, w, h) => {
        console.log(gl)
        gl.fillStyle = "#FF0000";
        gl.fillRect(x, y, w, h);
    };
</script>

<canvas id="game" {width} {height} class="border-white border-8" />

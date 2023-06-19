<script>
    import Button from "../lib/common/Button.svelte";
</script>

<div class="mt-10 h-full">
    <div class="flex flex-col items-center min-h-full justify-center gap-6">
        <h1 class="text-5xl font-bold">GEOSPACE</h1>
        <div class="max-w-3xl">
            Geospace è un coinvolgente web-game di riflessi che mette alla prova
            la velocità e l'abilità dei giocatori.
        </div>

        <Button type="primary" on:click={() => (window.location.href = "#/play")}
            >PLAY</Button
        >
    </div>
</div>

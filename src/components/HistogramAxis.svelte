<script>
    import { fade } from 'svelte/transition';

    export let scale;
    export let label;

    $: left = scale.range()[0];
    $: right = scale.range()[1];
    $: width = right - left;

    $: ticks = scale.ticks();
</script>

<div
    class="histogram-axis"
    transition:fade={{duration: 200}}
>
    <div
        class="line"
        style="left: {left}px; width: {width}px;"
    ></div>
    <div class="ticks">
        {#each ticks as tick}
            <div
                class="tick"
                style="left: {scale(tick)}px;"
            >
                {tick}
            </div>
        {/each}
    </div>
    <div class="label">
        {label}
    </div>
</div>

<style lang="scss">
    .histogram-axis {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 120;
        isolation: isolate;
        pointer-events: none;
    }

    .line {
        position: absolute;
        top: 82%;
        height: 3px;
        border-top: 1px solid #000000;
    }

    .ticks {
        position: absolute;
        top: 82%;
    }

    .tick {
        position: absolute;
        color: #000000;
        font-size: 1rem;
        transform: translateX(-50%);
    }

    .label {
        position: absolute;
        top: 86%;
        width: 100%;
        color: #000000;
        font-size: 1rem;
        text-align: center;
    }
</style>
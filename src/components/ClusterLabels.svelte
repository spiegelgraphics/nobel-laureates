<script>
    import { fade } from 'svelte/transition';

    import { dictionary } from '../utils/dictionary';

    export let data = [];
    export let showLabels = false;
    export let minNodes = 15;

    $: labels = data.map((d, i) => {
        return {
            id: i,
            x: d.x,
            y: d.y,
            label: dictionary[d.category] || '',
            numNodes: d.data.length
        };
    }).filter(d => d.numNodes >= minNodes);
</script>

{#if (showLabels)}
    <div class="cluster-labels">
        {#each labels as { id, x, y, label } (id)}
            <div
                class="label"
                style="top: {y}px; left: {x}px;"
                transition:fade={{duration: 200}}
            >
                {label}
            </div>
        {/each}
    </div>
{/if}

<style lang="scss">
    .cluster-labels {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 100;
        isolation: isolate;
        pointer-events: none;
    }

    .label {
        position: absolute;
        padding: 0.5rem 1rem;
        color: #000000;
        font-size: 1rem;
        text-align: center;
        text-shadow: #FFFFFF 0px 0px 4px, #FFFFFF 0px 0px 4px, #FFFFFF 0px 0px 4px, #FFFFFF 0px 0px 4px, #FFFFFF 0px 0px 4px, #FFFFFF 0px 0px 4px;
        transform: translateX(-50%) translateY(-50%);
    }
</style>
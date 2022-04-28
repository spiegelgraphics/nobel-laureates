<script>
    import { onMount } from 'svelte';

    import { canvasHeight } from '../stores/dimensions';
    import { steps, currentStep } from '../stores/steps';
    import { laureates, ageScale } from '../stores/data';
    import { prizeCategoryColors } from '../utils/colors';

    import Legend from './Legend.svelte';
    import Laureates from './Laureates.svelte';
    import HistogramAxis from './HistogramAxis.svelte';
    import ClusterLabels from './ClusterLabels.svelte';
    import HoverLabels from './HoverLabels.svelte';

    export let width = 0;
    export let progress = 0.0;

    let hoverItem = null;
    let ready = false;

    onMount(() => {
        setTimeout(() => {
            ready = true;
        }, 500);
    });

    $: {
        const { id: currentId } = $currentStep || {};
        const nextStep = $steps.filter(d => d.position <= progress).slice(-1)[0];
        if (nextStep && currentId !== nextStep.id) {
            currentStep.set(nextStep);
        }
    }

    $: ({
        highlightIds = [],
        exclusiveIds = [],
        description = {},
        showCategoryLabels = false,
        inner_layout: { type: layoutType} = {}
    } = $currentStep || {});
</script>

{#if (ready)}
<div
    class="scrolly-visualization"
>
    <div
        class="bottom-container"
        bind:clientHeight={$canvasHeight}
    >
        <Laureates
            width={width}
            height={$canvasHeight}
            data={$laureates}
            highlightIds={highlightIds}
            exclusiveIds={exclusiveIds}
            enlargeRadiusOnHighlight={layoutType === 'histogram'}
            bind:hoverItem={hoverItem}
        />
        {#if (layoutType === 'histogram')}
            <HistogramAxis
                scale={$ageScale}
                label="Alter bei Preisverleihung"
            />
        {/if}
        <ClusterLabels
            data={$laureates}
            showLabels={showCategoryLabels}
        />
        <HoverLabels
            bind:hoverItem={hoverItem}
            width={width}
            height={$canvasHeight}
        />
    </div>
    <Legend
        data={prizeCategoryColors}
    />
</div>
{/if}

<style lang="scss">
    .scrolly-visualization {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
        height: 100%;
    }

    .bottom-container {
        flex: 1;
        position: relative;
    }
</style>
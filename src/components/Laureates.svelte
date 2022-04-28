<script>
    import { minBy } from 'lodash-es';

    import { laureateColor, invertedLaureateColor } from '../stores/colors';
    import { prizeCategoryColors } from '../utils/colors';

    import Canvas from './Canvas.svelte';
    import Laureate from './Laureate.svelte';

    export let width = 0;
    export let height = 0;
    export let data = [];
    export let highlightIds = [];
    export let hoverItem = null;
    export let enlargeRadiusOnHighlight = false;

    function handleMousemove(e) {
        const { offsetX: x, offsetY: y } = e;
        const closest = minBy(renderedData.map(d => {
            return {
                ...d,
                diff: Math.hypot(x - d.xTransformed, y - d.yTransformed)
            }; 
        }), 'diff');

        if (closest && closest.diff < closest.radius * 1.5) {
            if (hoverItem && hoverItem.id === closest.id) return;
            hoverItem = null;
            hoverItem = {...closest};
            return;
        }
    
        hoverItem = null;
    }

    $: renderedData = data.map(d => {
        const { x = 0, y = 0 } = d;
        return d.data.map(dd => {
            return {
                ...dd,
                xTransformed: x + dd.x,
                yTransformed: y + dd.y,
                outlines: dd.prize_category.map(ddd => prizeCategoryColors[ddd]).reverse(),
                image: dd.image_source !== 'NA' ? dd.image_source : null,
                show: !isNaN(dd.x) && !isNaN(dd.y)
            };
        });
    }).flat();
</script>

<div
    class="laureates"
>
    <Canvas
        width={width}
        height={height}
        --position="absolute"
        --z-index="0"
        on:mousemove={handleMousemove}
    >
        {#each renderedData as { id, xTransformed: x, yTransformed: y, radius, withinClusterIndex = 0, outlines, show } (id)}
            {#if (show)}
                <Laureate
                    x={x}
                    y={y}
                    radius={enlargeRadiusOnHighlight && highlightIds.includes(id) ? radius * 3 : radius}
                    color={$laureateColor}
                    outlines={hoverItem && hoverItem.id === id ? [$invertedLaureateColor] : outlines}
                    delay={withinClusterIndex / 10}
                    isHighlight={highlightIds.includes(id)}
                    isBackground={highlightIds.length && !highlightIds.includes(id)}
                />
            {/if}
        {/each}
    </Canvas>
</div>

<style lang="scss">
    .laureates {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 100;
        isolation: isolate;
        pointer-events: all;
    }
</style>
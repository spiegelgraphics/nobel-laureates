<script>
    import { isMobile } from '../stores/devices';

    import HoverLabel from './HoverLabel.svelte';

    export let hoverItem = null;
    export let width = 0;
    export let height = 0;
</script>

<div class="hover-labels">
    {#if (hoverItem)}
        <HoverLabel
            item={hoverItem}
            parentWidth={width}
            parentHeight={height}
            hasCloseButton={$isMobile}
            on:closeclick={() => hoverItem = null}
        />
    {/if}
</div>

<style lang="scss">
    .hover-labels {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 130;
        isolation: isolate;
        pointer-events: none;
    }
</style>
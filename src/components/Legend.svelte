<script>
    import { dictionary } from '../utils/dictionary';

    export let data = {};

    $: items = Object.keys(data).map(key => {
        return {
            label: dictionary[key],
            color: data[key]
        };
    });
</script>

<div class="legend">
    {#each items as { label, color }}
        <div class="legend-item">
            <span class="color" style="background-color: {color};"></span>
            <span class="label">{label}</span>
        </div>
    {/each}
</div>

<style lang="scss">
    .legend {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 0.75rem;
        width: 100%;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 0.25rem;

        .color {
            display: inline-block;
            width: 12px;
            height: 12px;
            border: none;
            border-radius: 50%;
        }

        .label {
            color: #000000;
            font-size: 1rem;
        }
    }
</style>
<script>
    import { createEventDispatcher } from 'svelte';
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    import { dictionary } from '../utils/dictionary';

    export let item = {};
    export let parentWidth = 0;
    export let parentHeight = 0;
    export let hasCloseButton = false;

    const dispatch = createEventDispatcher();

    const tTop = tweened(null, {
        duration: 200,
        easing: cubicOut
    })

    const tLeft = tweened(null, {
        duration: 200,
        easing: cubicOut
    })

    let width = 0;
    let height = 0;

    function handleCloseClick() {
        dispatch('closeclick');
    }

    $: ({
        id,
        xTransformed: x,
        yTransformed: y,
        name,
        birth_country,
        prize_category: categories,
        prize_motivation: motivations,
        prize_year: years,
        radius: offset
    } = item);

    $: tTop.set(y + offset < 0 ? 0 : y + offset + height > parentHeight ? y - height - offset : y + offset);
    $: tLeft.set(x - width / 2 < 0 ? 0 : x - width / 2 + width > parentWidth ? parentWidth - width : x - width / 2);
</script>

<div
    class="hover-label"
    style="top: {$tTop}px;
           left: {$tLeft}px;"
    bind:clientWidth={width}
    bind:clientHeight={height}
>
    <div class="title">
        <h3>
           {name}
        </h3>
        {#if (hasCloseButton)}
            <button
                on:click={handleCloseClick}
            >
                <span>+</span>
            </button>
        {/if}
    </div>
    {#if dictionary[birth_country]}
        <h4 class="country">Geburtsort: {dictionary[birth_country]}</h4>
    {/if}
    <h4>
        {years[0]}: {dictionary[categories[0]]}
    </h4>
    <p>
        »{@html motivations[0].trim()}«
    </p>
    {#if (years[1])}
        <h4>
            {years[1]}: {dictionary[categories[1]]}
        </h4>
    {/if}
    {#if (motivations[1])}
        <p>
            »{@html motivations[1].trim()}«
        </p>
    {/if}
</div>

<style lang="scss">
    .hover-label {
        position: absolute;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        min-width: 200px;
        max-width: 300px;
        padding: 0.5rem;
        background-color: #FFFFFF;
        border: none;
        border-radius: 1.5px;
        pointer-events: none;
    }

    .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    h3, h4, p {
        margin: 0;
        padding: 0;
        color: #000000;
        font-size: 1rem;
    }

    h3 {
        margin: 0.25rem 0;
        font-size: 1.125rem;
        font-weight: bold;
    }

    h4 {
        font-size: 1rem;
        font-weight: bold;

      &.country{
        color: #BBB9B7;
        font-weight: normal;
        margin-top: -.5rem;
        padding-top: 0;
        &:empty{
          display:none;
        }
      }
    }

    p {
        margin-bottom: 0.5rem;
    }

    button {
        margin: 0;
        padding: 0;
        color: #000000;
        font-size: 1.5rem;
        border: none;
        outline: none;
        background: none;
        pointer-events: all;

        span {
            display: inline-block;
            transform: rotate(45deg) translateY(-10%);
        }
    }
</style>
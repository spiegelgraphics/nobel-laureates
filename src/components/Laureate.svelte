<script>
    import { getContext, onMount, onDestroy, afterUpdate } from 'svelte';
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import { pie, arc } from 'd3';
  
    export let x = 0;
    export let y = 0;
    export let radius = 4;
    export let color = '#000000';
    export let outlines = ['#000000'];
    export let alpha = 1;
    export let delay = 0;
    export let isHighlight = false;
    export let isBackground = false;
    export let contextName = 'canvas';
  
    const { register, deregister, invalidate } = getContext(contextName);

    const tX = tweened(null, tweenParameters);
    const tY = tweened(null, tweenParameters);
    const tRadius = tweened(0, tweenParameters);
    const tAlpha = tweened(0, tweenParameters);

    const pieGenerator = pie()  
        .padAngle(0.05)
        .sort(null)
        .value((_, i, arr) => 1 / arr.length);
  
    function draw(ctx) {
        ctx.translate($tX, $tY);

        ctx.fillStyle = color;
        ctx.globalAlpha = $tAlpha;
        
        ctx.beginPath();
        ctx.arc(0, 0, $tRadius, 0, 2 * Math.PI, false);
        ctx.fill();

        outlineArcs.forEach(outlineArc => {
            const { path, color } = outlineArc;
            ctx.fillStyle = color;
            const p = new Path2D(path);
            ctx.fill(p);
        });
    }
  
    onMount(() => {
        register(draw);
        invalidate();
        
        return () => {
            deregister(draw);
        };
    });
  
    afterUpdate(invalidate);

    onDestroy(invalidate);

    $: tweenParameters = {
        duration: 400,
        easing: cubicOut,
        delay
    };

    $: tX.set(x, tweenParameters);
    $: tY.set(y, tweenParameters);
    $: tRadius.set(radius, tweenParameters);
    $: tAlpha.set(isHighlight ? 1.0 : isBackground ? 0.1 : alpha);

    $: arcGenerator = arc()
        .innerRadius($tRadius < 5 ? 0 : $tRadius < 15 ? $tRadius * 0.6 : $tRadius * 0.8)
        .outerRadius($tRadius)
        .cornerRadius(1.5);

    $: outlineArcs = pieGenerator(outlines).map(d => {
        return {
            path: arcGenerator(d),
            color: d.data
        };
    });
  </script>
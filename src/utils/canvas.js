// adapted from https://github.com/Wattenberger/svelte-recipes/blob/master/src/components/examples/scale-canvas.js
export const scaleCanvas = (canvas, ctx, width, height, center = true) => {
    // assume the device pixel ratio is 1 if the browser doesn't specify it
    const devicePixelRatio = window.devicePixelRatio || 1;
  
    // determine the 'backing store ratio' of the canvas ctx
    const backingStoreRatio =
        ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio ||
        1;
  
    // determine the actual ratio we want to draw at
    const ratio = devicePixelRatio / backingStoreRatio;
  
    if (devicePixelRatio !== backingStoreRatio) {
        // set the 'real' canvas size to the higher width/height
        canvas.width = width * ratio;
        canvas.height = height * ratio;
    
        // ...then scale it back down with CSS
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
    } else {
        // this is a normal 1:1 device; just scale it simply
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = '';
        canvas.style.height = '';
    }
  
    // scale the drawing ctx so everything will work at the higher ratio
    ctx.scale(ratio, ratio);
  
    if (center) {
        ctx.translate(width / 2, height / 2);
    }
};
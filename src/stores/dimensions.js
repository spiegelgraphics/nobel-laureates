import { writable, derived } from 'svelte/store';

export const width = writable(0);
export const height = writable(0);
export const canvasHeight = writable(0);

export const minDim = derived([width, height], ([$width, $height]) => {
    return Math.min($width, $height);
});

export const radius = derived(minDim, $minDim => {
    return Math.max(4, ($minDim ** 2) / 120000);
});
import { readable, writable } from 'svelte/store';
import { json } from 'd3';

const dataPath = 'steps.json';

export const steps = readable([], async set => {
    const data = await json(dataPath);

    const n = data.length - 1;
    const fData = data.map((d, i) => {
        return {
            id: i,
            ...d,
            position: i / n - (0.5 / n)
        };
    });
    
    set(fData);
});

export const currentStep = writable(null);
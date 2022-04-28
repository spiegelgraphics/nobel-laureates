import { derived, writable } from 'svelte/store';

import { width, height } from './dimensions';

export const isMobile = derived(width, $width => {
    return $width < 520;
});

export const isSmall = derived(width, $width => {
    return $width < 720;
});

export const headerHeight = writable(100);

export const top = derived([height, headerHeight], ([$height, $headerHeight]) => {
    return $headerHeight / $height;
});

export const bottom = derived([height, headerHeight], ([$height, $headerHeight]) => {
    return ($headerHeight + $height + 20) / $height;
});

export const contentHeight = derived([height, headerHeight], ([$height, $headerHeight]) => {
    const availableHeight = $height - $headerHeight - 15;
    return Math.max(0, availableHeight);
});
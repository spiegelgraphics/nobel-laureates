import { readable, derived } from 'svelte/store';
import { csv, autoType, scaleLinear, extent } from 'd3';
import { sortBy } from 'lodash-es';

import { currentStep } from './steps';
import { radius, width, canvasHeight as height } from './dimensions';
import { layoutClusterForce, layoutPhyllotaxis, layoutHistogram } from '../utils/layout';
import { prizeCategoryColors } from '../utils/colors';

const dataPath = 'laureates.csv';

const splitProperty = (s) => {
    if (s === undefined || s === null) return [];
    const sString = s.toString();
    return sString ? sString.split('|') : [];
};

export const rawLaureates = readable([], async set => {
    const data = await csv(dataPath, autoType);

    const fData = data.map(d => {
        return {
            ...d,
            uniform: splitProperty(d.uniform),
            gender: splitProperty(d.gender),
            birth_country: splitProperty(d.birth_country),
            prize_category: splitProperty(d.prize_category),
            prize_motivation: splitProperty(d.prize_motivation),
            prize_year: splitProperty(d.prize_year).map(d => +d),
            affiliation_country: splitProperty(d.affiliation_country),
            this_year: d.this_year === 'TRUE'
        };
    });

    const sortedData = sortBy(fData, item => {
        return Object.keys(prizeCategoryColors).indexOf(item.prize_category[0])
    });

    set(sortedData);
});

export const ageScale = derived([rawLaureates, width], ([$rawLaureates, $width]) => {
    const padding = 16;
    const scale = scaleLinear()
        .domain(extent($rawLaureates.filter(d => !isNaN(d.age_at_prize) && d.age_at_prize !== 'NA'), d => d.age_at_prize))
        .range([padding, $width - padding]);
    return scale;
});

export const sortedLaureates = derived([rawLaureates, currentStep], ([$rawLaureates, $currentStep]) => {
    if (!$currentStep) return [];
    const { cluster_by: clusterBy, exclusiveIds = [] } = $currentStep || {};
    if (!clusterBy) return [];

    const categories = [...new Set($rawLaureates.map(d => d[clusterBy]).flat())];
    
    const clusterData = categories.map(cat => {
        const data = $rawLaureates
            .filter(d => d[clusterBy][0] === cat)
            .filter(d => exclusiveIds.length ? exclusiveIds.includes(d.id) : true);
        return {
            category: cat,
            data
        };
    });

    return clusterData;
});

export const laureates = derived(
    [sortedLaureates, currentStep, width, height, radius, ageScale],
    async (
        [$sortedLaureates, $currentStep, $width, $height, $radius, $ageScale],
        set
    ) => {
        const { inner_layout, outer_layout, exclusiveIds = [] } = $currentStep || {};
        const radiusFactor = exclusiveIds.length ? 6 : 1;

        const { type: typeInner } = inner_layout || {};
        const { type: typeOuter } = outer_layout || {};

        let layoutedInner = $sortedLaureates;
        if (typeInner === 'phyllotaxis') {
            layoutedInner = $sortedLaureates.map(({ category, data }) => {
                return layoutPhyllotaxis(data, $radius * radiusFactor, category);
            });
        } else if (typeInner === 'histogram') {
            layoutedInner = (await Promise.all($sortedLaureates.map(async ({ category, data }, i, arr) => {
                const beeData = await layoutHistogram(
                    data,
                    $radius * radiusFactor / 2,
                    d => $ageScale(d.age_at_prize),
                    (i + 1) / arr.length * $height * 0.8,
                    'age_at_prize',
                    (arr.length === 1 ? $radius * 2 : $radius) * radiusFactor,
                    category
                );
                return beeData;
            }))).map(d => ({index: 0, data: d}));
        }

        let layoutedOuter = layoutedInner;
        if (typeOuter === 'clusterForce') {
            layoutedOuter = await layoutClusterForce(layoutedInner, $width, $height, 2 * $radius * radiusFactor);
        }

        set(layoutedOuter);
    },
[]);
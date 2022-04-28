import { max, forceSimulation, forceCenter, forceCollide } from 'd3';

const goldenRatio = (1 + Math.sqrt(5)) / 2;

export const layoutPhyllotaxis = (
    data,
    radius = 4,
    category,
    radiusOffset = radius / 2,
    spacing = radius * 1.2,
    theta = 2 * Math.PI / goldenRatio
) => {
    const layoutedData = data.map((d, i) => {
        const scaledTheta = theta * i;
        const scaledRadius = spacing * Math.sqrt(i) + radiusOffset;

        return {
            ...d,
            radius,
            x: Math.cos(scaledTheta) * scaledRadius,
            y: Math.sin(scaledTheta) * scaledRadius,
            withinClusterIndex: i
        };
    });

    const clusterRadius = max(layoutedData.map(d => [Math.abs(d.x), Math.abs(d.y)]).flat());
    
    const metaResult = {
        clusterRadius,
        category,
        data: layoutedData
    };

    return metaResult;
};

export const layoutClusterForce = (data, width, height, spacing = 0) => {
    return new Promise((resolve) => {
        let dataCopy = [...data];

        forceSimulation()
            .nodes(dataCopy)
            .force('collision', forceCollide(d => (d.clusterRadius || 1) + spacing))
            .force('center', forceCenter(width / 2, height / 2))
            .on('tick', () => {
                for (let i = 0; i < dataCopy.length; i++) {
                    const d = dataCopy[i];
                    const r = (d.clusterRadius || 1) + spacing;
                    d.x = Math.max(r, Math.min(width - r, d.x));
                    d.y = Math.max(r, Math.min(height - r, d.y));
                }
            })
            .on('end', () => resolve(dataCopy))
            .alphaMin(0.8);
    });
};

export const layoutHistogram = (data, radius = 1, x = d => d, fy = 0, catType, offset = radius * 2, category) => {
    const scaledData = data.map(d => ({...d, x: +x(d), y: 0}));

    const histo = scaledData.reduce((acc, cur) => {
        const entry = cur[catType].toString();
        if (acc[entry]) {
            return {...acc, [entry]: [...acc[entry], {...cur, y: cur.y + offset * acc[entry].length}]};
        } else {
            return {...acc, [entry]: [cur]};
        }
    }, {});

    const result = Object.values(histo).flat().map((d, i) => {
        return {
            ...d,
            category,
            y: -d.y + fy,
            radius,
            withinClusterIndex: i * 10
        };
    });

    return result;
};
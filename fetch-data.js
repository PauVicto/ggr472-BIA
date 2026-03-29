const https = require('https');
const fs = require('fs');
const path = require('path');

const BBOX = { west: -79.320, east: -79.270, south: 43.657, north: 43.680 };

function inBbox(lng, lat) {
    return lng >= BBOX.west && lng <= BBOX.east && lat >= BBOX.south && lat <= BBOX.north;
}

const DATASETS = [
    {
        name: 'washrooms',
        resourceId: '1c7d1063-2562-4de3-8cd3-4cef48419f6f',
        outputFile: path.join(__dirname, 'json-data', 'washrooms.geojson'),
        filter: (r, lng, lat) => inBbox(lng, lat),
        pickProps: (r) => ({
            name: r.alternative_name || r.location || 'Washroom',
            location: r.location || '',
            type: r.type || '',
            hours: r.hours || '',
            address: r.address || '',
            accessible: r.accessible || '',
            status: r.Status || ''
        })
    },
    {
        name: 'drinking-fountains',
        resourceId: '446a7745-78fb-4e37-b6c8-71f9967e09eb',
        outputFile: path.join(__dirname, 'json-data', 'drinking-fountains.geojson'),
        filter: (r, lng, lat) => inBbox(lng, lat),
        pickProps: (r) => ({
            name: r.alternative_name || r.location || 'Drinking Fountain',
            location: r.location || '',
            type: r.type || '',
            location_details: r.location_details || '',
            address: r.address || '',
            status: r.Status || ''
        })
    },
    {
        name: 'benches',
        resourceId: '8c75bb59-5e1c-40e9-a69a-2072da59dcf6',
        outputFile: path.join(__dirname, 'json-data', 'benches.geojson'),
        filter: (r, lng, lat) => r.BIA === 'The Beach' && inBbox(lng, lat),
        pickProps: (r) => ({
            name: `Bench ${r.ID}`,
            address: `${r.ADDRESSNUMBERTEXT || ''} ${r.ADDRESSSTREET || r.FRONTINGSTREET || ''}`.trim(),
            status: r.STATUS || ''
        })
    }
];

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch (e) { reject(e); }
            });
        }).on('error', reject);
    });
}

async function fetchAll(resourceId) {
    const BASE = 'https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search';
    const LIMIT = 1000;
    let offset = 0;
    let total = Infinity;
    let records = [];

    while (offset < total) {
        const url = `${BASE}?id=${resourceId}&limit=${LIMIT}&offset=${offset}`;
        const json = await fetchJson(url);
        if (!json.success) throw new Error(`API error for resource ${resourceId}`);
        total = json.result.total;
        records = records.concat(json.result.records);
        offset += LIMIT;
        console.log(`  fetched ${records.length}/${total}`);
    }
    return records;
}

function toGeoJSON(records, dataset) {
    const features = [];
    for (const r of records) {
        if (!r.geometry) continue;
        let geom;
        try { geom = JSON.parse(r.geometry); } catch { continue; }
        if (!geom || !geom.coordinates) continue;
        const [lng, lat] = geom.coordinates;
        if (!dataset.filter(r, lng, lat)) continue;
        features.push({
            type: 'Feature',
            geometry: geom,
            properties: dataset.pickProps(r)
        });
    }
    return { type: 'FeatureCollection', features };
}

async function main() {
    for (const dataset of DATASETS) {
        console.log(`Fetching ${dataset.name}...`);
        const records = await fetchAll(dataset.resourceId);
        const geojson = toGeoJSON(records, dataset);
        fs.writeFileSync(dataset.outputFile, JSON.stringify(geojson, null, 2));
        console.log(`Wrote ${geojson.features.length} features to ${dataset.outputFile}\n`);
    }
}

main().catch(console.error);

//mar16 extract map configuration to a single config object
const MAP_CONFIG = {
    center: [-79.30043604297481, 43.66746180866858],
    zoom: 14,
    style: 'mapbox://styles/pau-victo/cmmqya137000y01s64wtr7038'
};

//mar16 route configuration — single source of truth for all seasonal routes
const ROUTES = [
    { id: 'fall', checkboxId: 'show-fall', color: '#DC7633', url: 'https://raw.githubusercontent.com/PauVicto/ggr472-BIA/refs/heads/main/json-data/472_fall_draft.geojson' },
    { id: 'spring', checkboxId: 'show-spring', color: '#58D68D', url: 'https://raw.githubusercontent.com/PauVicto/ggr472-BIA/refs/heads/main/json-data/472_spring_draft.geojson' },
    { id: 'summer', checkboxId: 'show-summer', color: '#F5B041', url: 'https://raw.githubusercontent.com/PauVicto/ggr472-BIA/refs/heads/main/json-data/472_summer_draft.geojson' },
    { id: 'winter', checkboxId: 'show-winter', color: '#5DADE2', url: 'https://raw.githubusercontent.com/PauVicto/ggr472-BIA/refs/heads/main/json-data/472_winter_draft.geojson' }
];

// city amenity layers — Toronto Open Data (filtered to The Beach)
const CITY_LAYERS = [
    { id: 'washrooms',          label: 'Washrooms',          icon: 'cross',          color: '#1565C0', file: 'washrooms.geojson',          checkboxId: 'washrooms-toggle' },
    { id: 'drinking-fountains', label: 'Drinking Fountains', icon: 'circle-stroked', color: '#00838F', file: 'drinking-fountains.geojson', checkboxId: 'fountains-toggle' },
    { id: 'benches',            label: 'Benches',            icon: 'square',         color: '#2E7D32', file: 'benches.geojson',            checkboxId: 'benches-toggle'   }
];

mapboxgl.accessToken = 'pk.eyJ1IjoicGF1LXZpY3RvIiwiYSI6ImNta2Rib2s1bTA5d2MzZW9vaGF2a3hrczkifQ.ie1nrw6qR60q70TUdf5B_w';

const map = new mapboxgl.Map({
    container: 'map',
    style: MAP_CONFIG.style,
    center: MAP_CONFIG.center,
    zoom: MAP_CONFIG.zoom
});

map.addControl(new mapboxgl.NavigationControl(), 'top-right');

map.on('load', () => {

    // Base POI source and Layer
    map.addSource('poi', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/PauVicto/ggr472-BIA/refs/heads/main/json-data/lab3map.geojson',
        generateId: true
    });

    map.addLayer({
        id: 'poi-layer',
        type: 'symbol',
        source: 'poi',
        layout: {
            'icon-image': ['match', ['get', 'category'],
                'Coffee', 'cafe',
                'Landmark/Attraction', 'star',
                'Parks/Greenspaces', 'building',
                'Recreation', 'circle',
                'marker'
            ],
            'icon-size': 0.9,
            'icon-allow-overlap': true
        },
        paint: {
            'icon-opacity': 0.8,
            'icon-color': ['match', ['get', 'category'],
                'Coffee', '#7a2e02',
                'Landmark/Attraction', '#fff700',
                'Parks/Greenspaces', '#008000',
                'Recreation', '#0026ff',
                '#FFFFFF'
            ]
        }
    });

    //mar16 DRY refactor — loop to add all route sources and layers from config
    ROUTES.forEach(route => {
        const sourceId = `${route.id}-route`;
        const lineLayerId = `${route.id}-route-layer`;
        const pointLayerId = `${route.id}-route-points`;

        map.addSource(sourceId, {
            type: 'geojson',
            data: route.url
        });

        map.addLayer({
            id: lineLayerId,
            type: 'line',
            source: sourceId,
            filter: ['==', '$type', 'LineString'],
            layout: { 'visibility': 'none' },
            paint: {
                'line-color': route.color,
                'line-width': 2
            }
        });

        map.addLayer({
            id: pointLayerId,
            type: 'symbol',
            source: sourceId,
            filter: ['==', '$type', 'Point'],
            layout: {
                'icon-image': 'star',
                'icon-size': 1.2,
                'icon-allow-overlap': true,
                'visibility': 'none'
            }
        });
    });

    // city amenity layers — loop to add sources and symbol layers from config
    CITY_LAYERS.forEach(layer => {
        const sourceId = `${layer.id}-source`;
        const layerId = `${layer.id}-layer`;

        map.addSource(sourceId, {
            type: 'geojson',
            data: `https://raw.githubusercontent.com/PauVicto/ggr472-BIA/refs/heads/main/json-data/${layer.file}`,
            generateId: true
        });

        map.addLayer({
            id: layerId,
            type: 'symbol',
            source: sourceId,
            layout: {
                'icon-image': layer.icon,
                'icon-size': 0.9,
                'icon-allow-overlap': true,
                'visibility': 'none'
            },
            paint: {
                'icon-color': layer.color,
                'icon-opacity': 0.85
            }
        });
    });

});

//mar16 shared popup helper — handles POI, route, and city amenity layer properties
function showPopup(e) {
    if (!e.features || !e.features[0]) return;
    const props = e.features[0].properties;
    const name = props.name || props.Name || 'Unknown';
    const detail = props.category || props.type || props.note || props.Note || '';
    const address = props.address || props.Address || '';
    const extra = props.hours ? `<br>${props.hours}` : (props.location_details ? `<br>${props.location_details}` : '');

    new mapboxgl.Popup()
        .setLngLat(e.features[0].geometry.coordinates)
        .setHTML(`<strong>${name}</strong><br>${detail}<br>${address}${extra}`)
        .addTo(map);
}

//mar16 single popup handler for POI layer
map.on('click', 'poi-layer', showPopup);

//mar16 loop for route point popups and cursor handlers
const interactiveLayers = ['poi-layer'];

ROUTES.forEach(route => {
    const pointLayerId = `${route.id}-route-points`;
    interactiveLayers.push(pointLayerId);
    map.on('click', pointLayerId, showPopup);
});

// city amenity layer click handlers
CITY_LAYERS.forEach(layer => {
    const layerId = `${layer.id}-layer`;
    interactiveLayers.push(layerId);
    map.on('click', layerId, showPopup);
});

//mar16 loop for cursor change on all interactive layers
interactiveLayers.forEach(layerId => {
    map.on('mouseenter', layerId, () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', layerId, () => {
        map.getCanvas().style.cursor = '';
    });
});

//mar16 loop for route toggle handlers
ROUTES.forEach(route => {
    const lineLayerId = `${route.id}-route-layer`;
    const pointLayerId = `${route.id}-route-points`;

    document.getElementById(route.checkboxId).addEventListener('change', (e) => {
        const visibility = e.target.checked ? 'visible' : 'none';
        //mar16 add layer existence check before toggling
        if (map.getLayer(lineLayerId)) {
            map.setLayoutProperty(lineLayerId, 'visibility', visibility);
        }
        if (map.getLayer(pointLayerId)) {
            map.setLayoutProperty(pointLayerId, 'visibility', visibility);
        }
    });
});

//mar16 POI toggle handler
document.getElementById('show-poi').addEventListener('change', (e) => {
    if (map.getLayer('poi-layer')) {
        map.setLayoutProperty('poi-layer', 'visibility', e.target.checked ? 'visible' : 'none');
    }
});

// city amenity toggle handlers
CITY_LAYERS.forEach(layer => {
    const layerId = `${layer.id}-layer`;
    document.getElementById(layer.checkboxId).addEventListener('change', (e) => {
        if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, 'visibility', e.target.checked ? 'visible' : 'none');
        }
    });
});

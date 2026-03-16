mapboxgl.accessToken = 'pk.eyJ1IjoicGF1LXZpY3RvIiwiYSI6ImNta2Rib2s1bTA5d2MzZW9vaGF2a3hrczkifQ.ie1nrw6qR60q70TUdf5B_w';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/pau-victo/cmmqya137000y01s64wtr7038',
    center: [-79.30043604297481,43.66746180866858],
    zoom: 14
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
                'Parks/Greenspaces', 'park',
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

    // Fall route source and layers
    map.addSource('fall-route', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/PauVicto/ggr472-BIA/refs/heads/main/json-data/472_fall_draft.geojson'
    });

    map.addLayer({
        id: 'fall-route-layer',
        type: 'line',
        source: 'fall-route',
        filter: ['==', '$type', 'LineString'],
        layout: {
            'visibility': 'none'
        },
        paint: {
            'line-color': '#DC7633',
            'line-width': 2
        }
    });

    map.addLayer({
        id: 'fall-route-points',
        type: 'symbol',
        source: 'fall-route',
        filter: ['==', '$type', 'Point'],
        layout: {
            'icon-image': 'star',
            'icon-size': 1.2,
            'icon-allow-overlap': true,
            'visibility': 'none'
        }
    });

    // Spring route source and layers
    map.addSource('spring-route', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/PauVicto/ggr472-BIA/refs/heads/main/json-data/472_spring_draft.geojson'
    });

    map.addLayer({
        id: 'spring-route-layer',
        type: 'line',
        source: 'spring-route',
        filter: ['==', '$type', 'LineString'],
        layout: {
            'visibility': 'none'
        },
        paint: {
            'line-color': '#58D68D',
            'line-width': 2
        }
    });
    map.addLayer({
        id: 'spring-route-points',
        type: 'symbol',
        source: 'spring-route',
        filter: ['==', '$type', 'Point'],
        layout: {
            'icon-image': 'star',
            'icon-size': 1.2,
            'icon-allow-overlap': true,
            'visibility': 'none'
        }
    });

    // Summer route source and layers
    map.addSource('summer-route', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/PauVicto/ggr472-BIA/refs/heads/main/json-data/472_summer_draft.geojson'
    });

    map.addLayer({
        id: 'summer-route-layer',
        type: 'line',
        source: 'summer-route',
        filter: ['==', '$type', 'LineString'],
        layout: {
            'visibility': 'none'
        },
        paint: {
            'line-color': '#F5B041',
            'line-width': 2
        }
    });

    map.addLayer({
        id: 'summer-route-points',
        type: 'symbol',
        source: 'summer-route',
        filter: ['==', '$type', 'Point'],
        layout: {
            'icon-image': 'star',
            'icon-size': 1.2,
            'icon-allow-overlap': true,
            'visibility': 'none'
        }
    });
    // Winter route source and layers
    map.addSource('winter-route', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/PauVicto/ggr472-BIA/refs/heads/main/json-data/472_winter_draft.geojson'
    });

    map.addLayer({
        id: 'winter-route-layer',
        type: 'line',
        source: 'winter-route',
        filter: ['==', '$type', 'LineString'],
        layout: {
            'visibility': 'none'
        },
        paint: {
            'line-color': '#5DADE2',
            'line-width': 2
        }
    });

    map.addLayer({
        id: 'winter-route-points',
        type: 'symbol',
        source: 'winter-route',
        filter: ['==', '$type', 'Point'],
        layout: {
            'icon-image': 'star',
            'icon-size': 1.2,
            'icon-allow-overlap': true,
            'visibility': 'none'
        }
    });

});

//ALL POPUPS

// base POI popups
map.on('click', 'poi-layer', (e) => {
    const name = e.features[0].properties.name;
    const category = e.features[0].properties.category;
    const address = e.features[0].properties.address;

    new mapboxgl.Popup()
        .setLngLat(e.features[0].geometry.coordinates)
        .setHTML(`<strong>${name}</strong><br>${category}<br>${address}`)
        .addTo(map);
});


//ROUTE POINTS need consistent property names (fix later)
// Fall route points popup
map.on('click', 'fall-route-points', (e) => {
    const name = e.features[0].properties.Name;
    const category = e.features[0].properties.Note;
    const address = e.features[0].properties.Address;

    new mapboxgl.Popup()
        .setLngLat(e.features[0].geometry.coordinates)
        .setHTML(`<strong>${name}</strong><br>${category}<br>${address}`)
        .addTo(map);
});

// Spring route points popup
map.on('click', 'spring-route-points', (e) => {
    const name = e.features[0].properties.Name;
    const category = e.features[0].properties.Note;
    const address = e.features[0].properties.Address;

    new mapboxgl.Popup()
        .setLngLat(e.features[0].geometry.coordinates)
        .setHTML(`<strong>${name}</strong><br>${category}<br>${address}`)
        .addTo(map);
});

// Summer route points popup
map.on('click', 'summer-route-points', (e) => {
    const name = e.features[0].properties.Name;
    const category = e.features[0].properties.Note;
    const address = e.features[0].properties.Address;

    new mapboxgl.Popup()
        .setLngLat(e.features[0].geometry.coordinates)
        .setHTML(`<strong>${name}</strong><br>${category}<br>${address}`)
        .addTo(map);
});

// Winter route points popup
map.on('click', 'winter-route-points', (e) => {
    const name = e.features[0].properties.Name;
    const category = e.features[0].properties.Note;
    const address = e.features[0].properties.Address;

    new mapboxgl.Popup()
        .setLngLat(e.features[0].geometry.coordinates)
        .setHTML(`<strong>${name}</strong><br>${category}<br>${address}`)
        .addTo(map);
});


// Interactivity Stuff, cursor change
map.on('mouseenter', 'poi-layer', () => {
    map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'poi-layer', () => {
    map.getCanvas().style.cursor = '';
});

map.on('mouseenter', 'fall-route-points', () => {
    map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'fall-route-points', () => {
    map.getCanvas().style.cursor = '';
});

map.on('mouseenter', 'spring-route-points', () => {
    map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'spring-route-points', () => {
    map.getCanvas().style.cursor = '';
});

map.on('mouseenter', 'summer-route-points', () => {
    map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'summer-route-points', () => {
    map.getCanvas().style.cursor = '';
});

map.on('mouseenter', 'winter-route-points', () => {
    map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'winter-route-points', () => {
    map.getCanvas().style.cursor = '';
});


// Toggle layers for the Routes (doesnt have POI recs yet)
document.getElementById('show-fall').addEventListener('change', (e) => {
    console.log('Fall route toggle:', e.target.checked);
    map.setLayoutProperty('fall-route-layer', 'visibility', e.target.checked ? 'visible' : 'none');
    map.setLayoutProperty('fall-route-points', 'visibility', e.target.checked ? 'visible' : 'none');
});

document.getElementById('show-spring').addEventListener('change', (e) => {
    console.log('Spring route toggle:', e.target.checked);
    map.setLayoutProperty('spring-route-layer', 'visibility', e.target.checked ? 'visible' : 'none');
    map.setLayoutProperty('spring-route-points', 'visibility', e.target.checked ? 'visible' : 'none');
});

document.getElementById('show-summer').addEventListener('change', (e) => {
    console.log('Summer route toggle:', e.target.checked);
    map.setLayoutProperty('summer-route-layer', 'visibility', e.target.checked ? 'visible' : 'none');
    map.setLayoutProperty('summer-route-points', 'visibility', e.target.checked ? 'visible' : 'none');
});

document.getElementById('show-winter').addEventListener('change', (e) => {
    console.log('Winter route toggle:', e.target.checked);
    map.setLayoutProperty('winter-route-layer', 'visibility', e.target.checked ? 'visible' : 'none');
    map.setLayoutProperty('winter-route-points', 'visibility', e.target.checked ? 'visible' : 'none');
});

//uncheck base POI layer
document.getElementById('show-poi').addEventListener('change', (e) => {
    console.log('Base POI toggle:', e.target.checked);
    map.setLayoutProperty('poi-layer', 'visibility', e.target.checked ? 'visible' : 'none')
});


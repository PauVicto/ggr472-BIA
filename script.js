// Creating the map and setting the access token
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hsb2Vsb2giLCJhIjoiY21sZ3UwZWYzMDIyazNocHNmcnFvbWZiNCJ9.S_Bvs5AGp4m2AF22M0fdiQ'; // Mapbox access token

const map = new mapboxgl.Map({
    container: 'my-map', // ID of the HTML element to contain the map
    style: 'mapbox://styles/chloeloh/cmm9ci4gs001301ry3yjqgd6x', // Map style URL
    center: [-79.3053, 43.6672], // Initial starting position on the Beach BIA
    maxBounds: [
        [-79.80, 43.65], // Southwest coordinates of the map bounds
        [-79.25, 43.80] // Northeast coordinates of the map bounds
    ],
    zoom: 13.8, // Initial zoom position
});

// Adds search control to map with plugin as source
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken, // Mapbox access token
        mapboxgl: mapboxgl, // Mapbox GL instance
        bbox: [-79.35, 43.65, -79.25, 43.68], // Limit results to maxBounds
        placeholder: 'Search in the Beach BIA', // Placeholder text in the search bar
        marker: false // Disable the default marker that appears when a search result is selected
    }),
    'top-left' // Position of the search control on the map
);


// Adds navigation controls to the map (zoom and rotation)
map.addControl(new mapboxgl.NavigationControl());


// Sets map load event listener to add the GeoJSON data source and layer
map.on('load', () => {
    // Adding my Mapbox style as a vector source to the map
    map.addSource('the-beach-pointsofinterest', {
        type: 'vector',
        url: 'mapbox://styles/chloeloh/cmm9ci4gs001301ry3yjqgd6x' // Map style URL containing GeoJSON data source
    });

    // Adding my GeoJSON for points of interest (coffee, parks, recreation)
    map.addSource('points-of-interest', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/chloeyloh/ggr472-lab3/refs/heads/main/lab3map.geojson', // Raw link to GeoJSON file in GitHub repository
        generateId: true // Automatically generate unique IDs for each feature in the GeoJSON for my event listeners
    });

    map.addLayer({
        id: 'locations-layer',
        type: 'symbol',
        source: 'points-of-interest',
        layout: {
            'icon-image': ['match', ['get', 'category'], // Using the "category" property in the GeoJSON to determine which icon to use
                'Coffee', 'mug', // If "category" is "coffee", use the "mug" icon
                'Landmark/Attraction', 'star2', // If "category" is "landmark/attraction", use the "star2" icon
                'Parks/Greenspaces', 'highway-rest-area', // If "category" is "park", use the "park" icon
                'Recreation', 'stadium', // If "category" is "recreation", use the "stadium" icon
                'marker' // Default icon
            ],
            'icon-size': [
                'case',
                ['boolean', ['feature-state', 'hover'], false], // If the "hover" state is true for a feature, use the larger size
                2.0, // Size of the icon when hovered
                1.5 // Default size of the icon
            ],
            'icon-allow-overlap': true // Allow icons to overlap each other
        },
        paint: {
            'icon-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false], // If the "hover" state is true for a feature, use full opacity
                1.0, // Opacity when hovered
                0.7 // Default opacity
            ],
            'icon-color': ['match', ['get', 'category'], // Using the "category" property in the GeoJSON to determine which color to use
                'Coffee', '#7a2e02', // If "category" is "coffee", use brown
                'Landmark/Attraction', '#fff700', // If "category" is "landmark/attraction", use yellow
                'Parks/Greenspaces', '#008000', // If "category" is "park", use green
                'Recreation', '#0026ff', // If "category" is "recreation", use blue
                '#FFFFFF' // Default color (white)
            ]
        }
    });

    // Creating click and hover events for the points of interest layer on the map
    let locID = null; // Variable to store the ID of the currently hovered feature

    // Adding event listener for mouse movement over the points of interest layer to create hover effect
    map.on('mousemove', 'locations-layer', (e) => {
        if (e.features.length > 0) {
            map.getCanvas().style.cursor = 'pointer'; // Change cursor to pointer when hovering over a feature

            // Reset the hover state of the previously hovered feature
            if (locID !== null) {
                map.setFeatureState(
                    { source: 'points-of-interest', id: locID },
                    { hover: false }
                );
            }

            locID = e.features[0].id; // Get the ID of the currently hovered feature

            // Set the hover state of the currently hovered feature to true
            map.setFeatureState(
                { source: 'points-of-interest', id: locID },
                { hover: true }
            );
        }
    });

    // Adding event listener for mouse leaving the points of interest layer to reset hover effect
    map.on('mouseleave', 'locations-layer', () => {
        if (locID !== null) {
            map.setFeatureState(
                { source: 'points-of-interest', id: locID },
                { hover: false }
            );
        }
        locID = null; // Reset the locID variable when the mouse leaves the layer
        map.getCanvas().style.cursor = ''; // Reset cursor to default
    });

    // Adding event listener for clicks on the points of interest layer to display a popup with information about the location
    map.on('click', 'locations-layer', (e) => {
        const name = e.features[0].properties.name; // Get the "name" property of the clicked feature
        const address = e.features[0].properties.address; // Get the "address" property of the clicked feature
        
        new mapboxgl.Popup()
            .setLngLat(e.features[0].geometry.coordinates) // Set the popup location to the coordinates of the clicked feature
            .setHTML(`<strong>${name}</strong><p>${address}</p>`) // Set the HTML content of the popup to display the name and address of the location
            .addTo(map); // Add the popup to the map
    }
    );
});

            

# Gems at the Beach BIA: Interactive Web Map

Our interactive geospatial application designed for **The Beaches (BIA)** in Toronto. This application visualizes curated seasonal walking routes and integrates dynamic public infrastructure data sourced directly from the City of Toronto Open Data Portal.

## Key Features
* **Seasonal Walking Routes**: Four distinct routes (**Fall, Spring, Summer, Winter**) featuring metadata for descriptions and unique theme colors.
* **Sidebar Navigation**: An interactive panel system that toggles route visibility and automatically zooms the map to the route's spatial bounds.
* **Visual Selection Feedback**: Custom JavaScript logic that applies a 2px solid border matching the route's theme color to the active sidebar panel for a clearer user experience.
* **City Amenity Layers**: Toggleable map layers for essential public infrastructure:
    * **Washrooms**: Detailed pop-ups with accessibility and their hours of operation.
    * **Drinking Fountains**: Includes bottle-refills and dog-friendly stations.
    * **Public Benches**: Specifically filtered for the The Beach BIA boundary.
* **Points of Interest**: Categorized markers for Coffee, Landmarks, Parks, and Recreation.

## Technical Implementation

* **Mapping Engine**: [Mapbox GL JS v3.4.0](https://docs.mapbox.com/mapbox-gl-js/api/).
* **Automated Data Workflow**: A custom Node.js utility (`fetch-data.js`) queries **CKAN**, filters records based on a strict spatial Bounding Box (BBOX), and generates cleaned GeoJSON files for map rendering.
* **Responsive UI/UX**:
    * **CSS Custom Properties**: Centralized color management for theme consistency across map layers and UI components.
    * **Exclusive Selection Logic**: State management to ensure map clarity by deactivating overlapping route highlights during navigation.
    * **Custom Map Controls**: Zoom to extent control to instantly reset the map to the default BIA view.

## Project Structure
* `index.html`: Application structure and sidebar layout.
* `script.js`: Core map logic, data-driven styling, and event handlers.
* `style.css`: Custom styling for the sidebar, interactive panels, and legend.
* `fetch-data.js`: Backend script for data retrieval.
* `/json-data/`: Local storage for seasonal route drafts and processed amenity GeoJSONs.

**Authors**: Chloe Loh, Rohan Hemrajani, Victoria Pau
**Course**: GGR472 - Developing Web Maps 
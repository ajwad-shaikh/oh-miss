
import { SouthAtlantic, Boundary } from './dataProvider.js';

//var Boundaries = boundaryFeatures;
new Vue({
    el: '#app',
    data: {
        /* Data properties will go here */
        map: null,
        tileLayer: null,
        layers: [
            {
              id: 0,
              name: 'South Atlantic Data Points',
              active: false,
              features: SouthAtlantic,
            },
            {
              id: 1,
              name: 'City/County Boundaries',
              active: false,
              features: Boundary,
            },
        ],
    },
    mounted() {
        /* Code to run when app is mounted */
        this.initMap();
        this.initLayers();
        this.featureEdit();
    },
    methods: { 
        /* Any app-specific functions go here */
        featureEdit() {
            
        },
        initMap() {
            this.map = L.map('map', {
                center: [0, 0],
                zoom: 2,
            });
            
            this.tileLayer = L.tileLayer(
            'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
            {
                maxZoom: 18,
                noWrap: true,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
            }
            );
            this.tileLayer.addTo(this.map);
        },
        initLayers() {
            var markerIcon = L.icon({
                iconUrl: 'img/favicon.png',
                iconSize: [10, 10],
            });
            this.layers.forEach((layer) => {
              // Initialize the layer
                const markerFeatures = layer.features.filter(feature => feature.type === 'marker');
                const polygonFeatures = layer.features.filter(feature => feature.type === 'polygon');
                markerFeatures.forEach((feature) => {
                    feature.leafletObject = L.marker(feature.coords, {icon: markerIcon})
                        .bindPopup(String(feature.coords));
                });
                polygonFeatures.forEach((feature) => {
                    feature.leafletObject = L.polygon(feature.coords)
                        .bindPopup(String(feature.coords));
                });
            });
        },          
        layerChanged(layerId, active) {
            /* Show or hide the features in the layer */
            const layer = this.layers.find(layer => layer.id === layerId);
            layer.features.forEach((feature) => {
                /* Show or hide the feature depending on the active argument */
                if (active) {
                    feature.leafletObject.addTo(this.map);
                } else {
                    feature.leafletObject.removeFrom(this.map);
                }
            });
        },
    },
});

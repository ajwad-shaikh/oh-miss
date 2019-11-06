import {
    SouthAtlantic,
    NorthAtlantic
} from './dataProvider.js';

// var Boundaries = boundaryFeatures;
var dataNorthAtlantic = [];
// console.log(dataNorthAtlantic);


console.log(SouthAtlantic);
new Vue({
    el: '#app',
    data: {
        /* Data properties will go here */
        map: null,
        tileLayer: null,
        layers: [{
                id: 0,
                name: 'South Atlantic Data Points',
                active: false,
                features: SouthAtlantic,
            },
            {
                id: 1,
                name: 'North Atlantic Data Points',
                active: false,
                features: dataNorthAtlantic,
            },
        ],
    },
    mounted() {
        /* Code to run when app is mounted */
        NorthAtlantic()
            .then((dataNorthAtlantic) => {
                this.layers[1].features = dataNorthAtlantic;
                this.initMap();
                this.initLayers();
                console.log(dataNorthAtlantic);
            });
    },
    methods: {
        /* Any app-specific functions go here */
        initMap() {

            this.map = L.map('map', {
                center: [0, 0],
                zoom: 2,
            });

            this.tileLayer = L.tileLayer(
                'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png', {
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
                //const markerFeatures = layer.features.filter(feature => feature.type === 'marker');
                console.log(layer);
                const markerFeatures = layer.features;
                const polygonFeatures = layer.features.filter(feature => feature.type === 'polygon');
                markerFeatures.forEach((feature) => {
                    feature.leafletObject = L.marker(feature.coords, {
                            icon: markerIcon
                        })
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
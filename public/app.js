import {
    SouthAtlantic,
    NorthAtlantic,
    dataFetcher
} from './dataProvider.js';

// var Boundaries = boundaryFeatures;
var dataNorthAtlantic = [];
var dataBundle = [];
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
                name: 'North Atlantic',
                active: false,
                features: dataBundle,
            },
            {
                id: 1,
                name: 'South Atlantic',
                active: false,
                features: dataBundle,
            },
            {
                id: 2,
                name: 'South Pacific',
                active: false,
                features: dataBundle,
            },
            {
                id: 3,
                name: 'Asia Pacific',
                active: false,
                features: dataBundle,
            },
            {
                id: 4,
                name: 'Southern Ocean',
                active: false,
                features: dataBundle,
            },
        ],
    },
    mounted() {
        /* Code to run when app is mounted */
        dataFetcher()
            .then((dataBundle) => {
                this.layers[0].features = dataBundle[0];
                this.layers[1].features = dataBundle[1];
                this.layers[2].features = dataBundle[2];
                this.layers[3].features = dataBundle[3];
                this.layers[4].features = dataBundle[4];
                this.initMap();
                this.initLayers();
                //console.log(dataNorthAtlantic);
            })
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
                const markerFeatures = layer.features.filter(feature => feature.type === 'marker');
                //console.log(layer);
                //const markerFeatures = layer.features;
                const polygonFeatures = layer.features.filter(feature => feature.type === 'polygon');
                markerFeatures.forEach((feature) => {
                    feature.leafletObject = L.marker(feature.coords, {
                            icon: markerIcon
                        })
                        .bindPopup(String(feature.temp));
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
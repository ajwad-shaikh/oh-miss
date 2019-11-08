import {
    dataFetcher
} from './dataProvider.js';

var dataBundle = [];
// console.log(dataNorthAtlantic);

new Vue({
    el: '#app',
    data: {
        /* Data properties will go here */
        map: null,
        tileLayer: null,
        layers: [{
                id: 0,
                name: 'South Atlantic',
                active: false,
                features: dataBundle,
            },
            {
                id: 1,
                name: 'North Atlantic',
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
                name: 'Norwegian',
                active: false,
                features: dataBundle,
            },
            {
                id: 4,
                name: 'Southern Ocean',
                active: false,
                features: dataBundle,
            },
            {
                id: 5,
                name: 'Russian Arctic',
                active: false,
                features: dataBundle,
            },
            {
                id: 6,
                name: 'Indian Ocean',
                active: false,
                features: dataBundle,
            },
        ],
    },
    mounted() {
        /* Code to run when app is mounted */
        this.initMap();
        dataFetcher()
            .then((dataBundle) => {
                this.layers[0].features = dataBundle[0];
                this.layers[1].features = dataBundle[1];
                this.layers[2].features = dataBundle[2];
                this.layers[3].features = dataBundle[3];
                this.layers[4].features = dataBundle[4];
                this.layers[5].features = dataBundle[5];
                this.layers[6].features = dataBundle[6];
                this.initLayers();
                console.log(dataBundle);
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
                    noWrap: false,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
                }
            );
            this.tileLayer.addTo(this.map);
        },
        initLayers() {
            var highIcon = L.icon({
                iconUrl: 'img/high_temp.png',
                iconSize: [10, 10],
            });
            var medIcon = L.icon({
                iconUrl: 'img/medium_temp.png',
                iconSize: [10, 10],
            });
            var lowIcon = L.icon({
                iconUrl: 'img/low_temp.png',
                iconSize: [10, 10],
            });
            
            this.layers.forEach((layer) => {
                // Initialize the layer
                const markerFeatures = layer.features.filter(feature => feature.type === 'marker');
                //console.log(layer);
                //const markerFeatures = layer.features;
                const polygonFeatures = layer.features.filter(feature => feature.type === 'polygon');
                markerFeatures.forEach((feature) => {
                    if(feature.temp < 5){
                        feature.leafletObject = L.marker(feature.coords, {
                            icon: lowIcon
                        })
                        .bindPopup(String(feature.temp));
                    }
                    else if(feature.temp > 15) {
                        feature.leafletObject = L.marker(feature.coords, {
                            icon: highIcon
                        })
                        .bindPopup(String(feature.temp));
                    }
                    else {
                        feature.leafletObject = L.marker(feature.coords, {
                            icon: medIcon
                        })
                        .bindPopup(String(feature.temp));
                    }
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
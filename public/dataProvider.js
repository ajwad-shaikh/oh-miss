var db = firebase.database();
// var north_atlantic = db.ref("dataset/north_atlantic")

// export const NorthAtlantic = () => {
//     north_atlantic.once("value")
//     .then(snapshot => snapshot.json());
// }

//var north_atlantic = db.ref("dataset/north_atlantic");

// export const NorthAtlantic = () => {
//     return north_atlantic.once("value")
//         .then(snapshot => {
//             var dataNorthAtlantic = [];
//             snapshot.forEach(function (childSnap) {
//                 dataNorthAtlantic.push(childSnap.val());
//             });
//             //console.log(dataNorthAtlantic);
//             return Promise.all(dataNorthAtlantic);
//         });
// };

// var dataset = db.ref("dataset");

// export const dataFetcher = () => {
//     return dataset.once("value")
//         .then(dataSnapshot => {
//             var dataNorthAtlantic = [],
//                 dataSouthAtlantic = [],
//                 dataAsiaPacific = [],
//                 dataSouthPacific = [],
//                 dataSouthernOcean = [],
//                 dataBundle = [];
//             dataSnapshot.child("north_atlantic")
//                 .forEach(function (childData) {
//                     dataNorthAtlantic.push(childData.val());
//                 });
//             dataBundle.push(dataNorthAtlantic);
//             dataSnapshot.child("south_atlantic")
//                 .forEach(function (childData) {
//                     dataSouthAtlantic.push(childData.val());
//                 });
//             dataBundle.push(dataSouthAtlantic);
//             dataSnapshot.child("south_pacific")
//                 .forEach(function (childData) {
//                     dataSouthPacific.push(childData.val());
//                 });
//             dataBundle.push(dataSouthPacific);
//             dataSnapshot.child("asia_pacific")
//                 .forEach(function (childData) {
//                     dataAsiaPacific.push(childData.val());
//                 });
//             dataBundle.push(dataAsiaPacific);
//             dataSnapshot.child("southern_ocean")
//                 .forEach(function (childData) {
//                     dataSouthernOcean.push(childData.val());
//                 });
//             dataBundle.push(dataSouthernOcean);
//             return Promise.all(dataBundle);
//         });
// }

var dataset = db.ref("newData");

export const dataFetcher = () => {
    return dataset.once("value")
        .then(dataSnapshot => {
            var dataNorthAtlantic = [],
                dataSouthAtlantic = [],
                dataNorwegian = [],
                dataSouthPacific = [],
                dataSouthernOcean = [],
                dataRussianArctic = [],
                dataIndianOcean = [],
                dataBundle = [];
            dataSnapshot.child("north_atlantic")
                .forEach(function (childData) {
                    dataNorthAtlantic.push(childData.val());
                });
            dataBundle.push(dataNorthAtlantic);
            dataSnapshot.child("south_atlantic")
                .forEach(function (childData) {
                    dataSouthAtlantic.push(childData.val());
                });
            dataBundle.push(dataSouthAtlantic);
            dataSnapshot.child("south_pacific")
                .forEach(function (childData) {
                    dataSouthPacific.push(childData.val());
                });
            dataBundle.push(dataSouthPacific);
            dataSnapshot.child("norwegian")
                .forEach(function (childData) {
                    dataNorwegian.push(childData.val());
                });
            dataBundle.push(dataNorwegian);
            dataSnapshot.child("southern_ocean")
                .forEach(function (childData) {
                    dataSouthernOcean.push(childData.val());
                });
            dataBundle.push(dataSouthernOcean);
            dataSnapshot.child("russia_arctic")
                .forEach(function (childData) {
                    dataRussianArctic.push(childData.val());
                });
            dataBundle.push(dataRussianArctic);
            dataSnapshot.child("indian_ocean")
                .forEach(function (childData) {
                    dataIndianOcean.push(childData.val());
                });
            dataBundle.push(dataIndianOcean);
            return Promise.all(dataBundle);
        });
}
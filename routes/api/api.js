const express = require('express');
const apiRouter = express.Router();
const db = require("../../firebase/firebase");
const strikesRef = db.ref("strikes");
const byCountryRef = db.ref('by_country');
const gmaps = require('../../gmaps/gmaps');
const geo = require('../../middleware/geo');


// ALL OPTIONAL PARAMS BASED FILTER
const compileOptionalParams = (params) => {
    const { country, r, origin, start_year, end_year, lat, lng } = params

    const possibleParams = {
        'country' : country,
        'r' : parseInt(r, 10),
        'origin' : origin,
        'lat' : parseFloat(lat),
        'lng' : parseFloat(lng),
        'start_year' : start_year,
        'end_year' : end_year,
    };

    return Object.keys(possibleParams).reduce((verifiedParams, currentFilt) => {
        if (possibleParams[currentFilt]) {
            verifiedParams[currentFilt] = possibleParams[currentFilt]
        }
        return verifiedParams;
    }, {})
};

const filters = {
    'country': (data, country) => data.filter(curr => curr.country.toLowerCase() === country.toLowerCase()),
    'lat' : (data, lat) => data.filter(curr => parseFloat(curr.lat) === parseFloat(lat)),
    'start_year' : (data, start_year) => data.filter(curr => new Date(curr.date).getFullYear() >= parseInt(start_year, 10)),
    'end_year': (data, end_year) => data.filter(curr => new Date(curr.date).getFullYear() <= parseInt(end_year, 10)),
    // 'r' : parseInt(r, 10),
    // 'origin' : origin,
    // 'lat' : parseFloat(lat),
    // 'lng' : parseFloat(lng),
}

const dataFilter = (params, fullDataSet) => {
    return Object.keys(params) // ['country', 'end_year']
        .reduce((_data, currentParam) => {  // 1. country, 2. end_year
            const filterMethod = filters[currentParam]; // find the function from `filters`
            if (typeof filterMethod !== "function") {
                console.log('lol')
                return _data; // if not found, chill
            }
            const paramValue = params[currentParam]; // get what user passed in
            return filterMethod(_data, paramValue); // pass in *_data* which is what we are cutting down on
        }, fullDataSet); // full data is starting point
};

// CORS
apiRouter.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// FULL DATA
// All DATA DRONE STRIKE DATA
// ex. https://localhost:8443/api/v1/
apiRouter.get('/', (req,res) => {
    strikesRef.once("value", (snap) => {
        const params = compileOptionalParams(Object.assign({}, req.query ));
        const data = snap.val();
        res.send(dataFilter(params, data))
    });
});

// COUNTRY
// ALL STRIKES WITHIN SPECIFIC COUNTRY
// prefilter by country based on REST route, additional filters via paramaterized function
// ex. https://localhost:8443/api/v1/country/yemen
apiRouter.get('/country/:country', (req, res) => {
    strikesRef.once("value", (snap) => {
        // console.log(snap.val());
        const data = snap.val();
        const { country } = req.params;
        const params = compileOptionalParams(Object.assign({}, req.query , { country }));
        /*
            {
                'country',
                'end_year'
            }

            Object

            Object.keys(params).reduce((_data, currentParam) => filters[currentParam](_data, params[currentParam]), data);
        */

        const filteredData = Object.keys(params) // ['country', 'end_year']
            .reduce((_data, currentParam) => {  // 1. country, 2. end_year
                const filterMethod = filters[currentParam]; // find the function from `filters`
                if (typeof filterMethod !== "function") {
                    return _data; // if not found, chill
                }

                const paramValue = params[currentParam]; // get what user passed in
                return filterMethod(_data, paramValue); // pass in *_data* which is what we are cutting down on
            }, data); // full data is starting point

        res.status(200).send(filteredData)
    });

    // getQueryParams(params)
    //     .then(data => {
    //         res.send(data)
    //     })
});

// KILLS
// ALL STRIKES WITH SPECIFIC NUMBER OF CASUALTIES
// ex. https://localhost:8443/api/v1/kills/yemen
apiRouter.get('/kills/:kills', (req, res) => {
    const {killed} = req.params;
    strikesRef.orderByChild("kills").startAt(0).endAt(killed).once("value")
        .then(snap => res.send(snap.val()))
})

// RADIUS
// ALL STRIKES WITHIN RADIUS of LATITUDE/LONGITUDE OBJECT
// ex. https://localhost:8443/api/v1/radius/500/origin/30.1024448,60.3421433
apiRouter.get('/radius/:radius/origin/:origin', (req,res) => {
    const {radius, origin} = req.params;
    const latlngStr = origin.split(',', 2);
    const originLatLng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};

    strikesRef.once("value")
        .then(snap => {
            return snap.val()
                .reduce((_hash , currentItem) => {
                    const destLatLng = {}
                        destLatLng.lat = parseFloat(currentItem.lat);
                        destLatLng.lng = parseFloat(currentItem.lon);
                    if(geo.haversineKM(originLatLng, destLatLng) <= radius ) {
                        // gmaps.reverseGeocode({ latlng: destLatLng }, (err, response) => {
                        //   if (!err) {
                        //     console.log(response.json.results[1].formatted_address);
                        //   }
                        // })
                        _hash.push(currentItem)
                    }
                    return _hash;
                }, [])
        })
        .then(data => {
            console.log(data)
            res.send(data)
        })
        .catch(err => console.error(err));
});

module.exports = apiRouter;

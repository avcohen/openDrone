const express = require('express');
const apiRouter = express.Router();
const db = require("../../firebase/firebase");
const strikesRef = db.ref();
const gmaps = require('../../gmaps/gmaps');
const geo = require('../../middleware/geo');
const postKey = require('../../firebase/postKey')

// ALL OPTIONAL PARAMS BASED FILTER
//
const compileOptionalParams = (params) => {
    const { country, kills, r, origin, start_year, end_year, lat, lng } = params

    const possibleParams = {
        'country' : country,
        'kills' : parseInt(kills, 10),
        'r' : parseInt(r, 10),
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
    'kills' : (data, kills) => data.filter(curr => parseInt(curr.kills,10) === parseInt(kills,10)),
    'lat' : (data, lat) => data.filter(curr => parseFloat(curr.lat) === parseFloat(lat)),
    'lng' : (data, lng) => data.filter(curr => parseFloat(curr.lng) === parseFloat(lng)),
    'start_year' : (data, start_year) => data.filter(curr => new Date(curr.date).getFullYear() >= parseInt(start_year, 10)),
    'end_year': (data, end_year) => data.filter(curr => new Date(curr.date).getFullYear() <= parseInt(end_year, 10)),
    // 'r' : (data, r , lat , lng) => data.filter(curr => parseFloat(curr.parseInt(r, 10),
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
        const data = snap.val();
        const { country } = req.params;
        const params = compileOptionalParams(Object.assign({}, req.query , { country }));
        res.send(dataFilter(params, data))
    });
});

// KILLS
// ALL STRIKES WITH SPECIFIC NUMBER OF CASUALTIES
// ex. https://localhost:8443/api/v1/kills/5
apiRouter.get('/kills/:kills', (req, res) => {
    strikesRef.once("value", (snap) => {
        const data = snap.val()
        const { kills } = req.params;
        const params = compileOptionalParams(Object.assign({}, req.query, { kills } ));
        res.send(dataFilter(params, data))
    });
})


// RADIUS
// ALL STRIKES WITHIN RADIUS of LATITUDE/LONGITUDE OBJECT
// ex. https://localhost:8443/api/v1/radius/500/origin/30.1024448,60.3421433
//
apiRouter.get('/radius/:radius/lat/:lat/lng/:lng', (req,res) => {
    const {radius, lat, lng} = req.params;
    const originLatLng = {lat, lng}
    const params = compileOptionalParams(Object.assign({}, req.query ));

    strikesRef.once("value")
        .then(snap => {
            return snap.val()
                .reduce((_hash , currentItem) => {
                    const targetLatLng = { lat : parseFloat(currentItem.lat) , lng : parseFloat(currentItem.lng) }

                    if(geo.haversineKM(originLatLng , targetLatLng) <= radius ) {
                        _hash.push(currentItem)
                    }
                    return _hash;
                }, [])
        })
        .then(data => res.send(dataFilter(params, data)) )
        .catch(err => console.error(err));
});

apiRouter.get('/start_year/:start_year', (req, res) => {
    strikesRef.once("value", (snap) => {
        const data = snap.val();
        const { start_year } = req.params;
        const params = compileOptionalParams(Object.assign({}, req.query, { start_year }));
        res.send(dataFilter(params, data))
    });
});

apiRouter.get('/end_year/:end_year', (req, res) => {
    strikesRef.once("value", (snap) => {
        const data = snap.val();
        const { end_year } = req.params;
        const params = compileOptionalParams(Object.assign({}, req.query, { end_year }));
        res.send(dataFilter(params, data))
    });
});

apiRouter.get('/start_year/:start_year/end_year/:end_year', (req, res) => {
    strikesRef.once("value", (snap) => {
        const data = snap.val();
        const { start_year , end_year } = req.params;
        const params = compileOptionalParams(Object.assign({}, req.query, { start_year, end_year }));
        res.send(dataFilter(params, data))
    });
});

apiRouter.post('/createEntry', (req, res) =>{
    if ( req.body.key ===  postKey.key) {
        const newStrikeData = {
            country : req.body.country,
            date : req.body.date,
            description : req.body.description,
            kills : req.body.kills,
            l1 : req.body.l1,
            l2 : req.body.l2,
            l3 : req.body.l3,
            l4 : req.body.l4,
            lat : req.body.lat,
            lng : req.body.lng
        };

        const newID = new Promise((resolve, reject) =>{
            strikesRef.once("value", (snap) => {
                resolve(snap.numChildren() + 1)
            })
        })

        newID.then((id) => {
            strikesRef.child(id).set(newStrikeData);
        })
        .then(() => res.send('Thanks ^___^'))
        .catch(e => console.error(e));
    } else {
        res.send('Unauthorized POST request');
    }


})


module.exports = apiRouter;

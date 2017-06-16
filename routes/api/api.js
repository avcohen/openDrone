const express = require('express');
const apiRouter = express.Router();
const db = require("../../firebase/firebase");
const strikesRef = db.ref("strikes");
const byCountryRef = db.ref('by_country');
const gmaps = require('../../gmaps/gmaps');
const geo = require('../../middleware/geo');


const getFilteredData = (queryParams) => {
    const {r, origin, country} = queryParams;
    return strikesRef.once("value", (snap) => {
        // reduce the snap.val()
        //
        const reducedData = snap.val().filter();
        return reducedData;

    });
}

// FULL STRIKES DATA
apiRouter.get('/', (req,res) => {
    // getFilteredData(res.query).then((data) => res.send(data))l
    strikesRef.once("value", (snap) => {
        res.send(snap);
    });
});

// Within x radius of latlng string , ex. "12.12,23.23"
apiRouter.get('/radius', (req,res) => {
    const {r, origin} = req.query;
    const latlngStr = origin.split(',', 2);
    const originLatLng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};

    strikesRef.once("value")
        .then(snap => {
            return snap.val()
                .reduce((_hash , currentItem) => {
                    const destLatLng = {}
                        destLatLng.lat = parseFloat(currentItem.lat);
                        destLatLng.lng = parseFloat(currentItem.lon);
                    if(geo.haversineKM(originLatLng, destLatLng) <= r ) {
                        gmaps.reverseGeocode({
                          latlng: destLatLng
                        }, (err, response) => {
                          if (!err) {
                            console.log(response.json.results[1].formatted_address);
                          }
                        })

                        _hash.push(currentItem)
                    }
                    return _hash;
                }, [])
        })
        .then(data => res.send(data))
        .catch(err => console.error(err));

    //   gmaps.reverseGeocode({
    //     latlng: latlng
    //   }, (err, response) => {
    //     if (!err) {
    //       res.send(response.json.results);
    //     }
    //   });
});


// casualties
// takes deaths and injuries as nums, lists all items >= values provided
apiRouter.get('/casualties', (req, res) => {
    const {killed} = req.query;
    strikesRef.orderByChild("kills").startAt(0).endAt(killed).once("value")
        .then(snap => res.send(snap.val()))
})

// deaths by administration
apiRouter.get('/administration', (req,res) => {
  const {q, start_date, end_date} = req.query
})

apiRouter.get('/country', (req, res) => {
    const {q} = req.query;
    // console.log(q, start_date, end_date);
    byCountryRef.child(q).once("value")
      .then(snap => snap.val())
      .then(data => {
        // console.log(data);
        res.send(data)
      })
});

/*
apiRouter.get('/country/:country', (req, res) => {
    const {country} = res.params;
    const {r, radius} = res.query;

    return getFilteredData({
        country,
        r,
        radius,
    }).then(d => res.send(d))
});
*/




// api params : country, kills, x radius from lat/long

module.exports = apiRouter;

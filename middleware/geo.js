let geo = {};

// takes two latlng objects ex. {lat : 12 , lng : 22}, uses Haversine Formula
geo.haversineKM = (latlng1, latlng2) =>{
  const p = 0.017453292519943295;
  const c = Math.cos;
  const a = 0.5 - c((latlng2.lat - latlng1.lat) * p)/2 +
          c(latlng1.lat * p) * c(latlng2.lat * p) *
          (1 - c((latlng2.lng - latlng1.lng) * p))/2;
  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

module.exports = geo;

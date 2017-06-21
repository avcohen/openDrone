# Dronemappr Data v0.1 :camel: :rocket:

A live version of the Dronemappr is available at [https://104.236.214.92:8443/api/](https://104.236.214.92:8443/api/)

_Please note the SSL certificate is self signed, you'll need to accept it prior to being able to access data._

## API Endpoints


### All Data

Search and return all openDrone data.

###### Path

    /api

###### Parameters

+ *none* - no parameters

###### Example
    http://base.url/api/

---

### By Country

Search and return all drone strikes within a specific country.

###### Path

    /api/country

###### Parameters

+ q - country name

###### Example
    http://base.url/api/country?q=yemen

---

### By Casualties

Search and return for all drone strikes with *n* or more casualties.

###### Path

    /api/casualties

###### Parameters

+ killed - number of casualties

###### Example
    http://base.url/api/casualties?killed=6

---

### By Date(s)

Search and return all drone strikes within a specific date range

###### Path

    /api/country

###### Parameters

+ q - country name

###### Example
    http://base.url/api/country?q=yemen

---

### Strikes Within Distance (KM)

Search and return for all drone strikes within a radius of *n* or more kilometers of a geographic coordinate (latitude , longitude).

###### Path

    /api/radius

###### Parameters

+ r - radius (in kilometers)
+ origin - point of origin as comma separated lattitude and longitude geographic coordinates.

###### Example
    http://base.url/api/radius?r=1200&origin=34.7221,38.7454

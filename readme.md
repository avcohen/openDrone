# openDrone Data v0.1 :camel: :rocket:

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

### Strikes Within Distance (KM)

Search and return for all drone strikes within a radius of *n* or more kilometers of a geographic coordinate (latitude , longitude).

###### Path

    /api/radius

###### Parameters

+ r - radius (in kilometers)
+ origin - point of origin as comma separated lattitude and longitude geographic coordinates.

###### Example
    http://base.url/api/radius?r=1200&origin=34.7221,38.7454

		

# Dronemappr API v1 :camel: :rocket:

A live version of the Dronemappr API is available at [http://api.dronemappr.com/api/v1/](http://api.dronemappr.com/api/v1/)

### About

Drone strikes, among other contentious issues of the world's current political climate, stand as one of many proverbial elephants in the room. However, seeing as drone strikes often go underreported and occur half a world away, our elephant is often nowhere to be seen.

The data available through this API has been meticulously collected by individuals at [The Cluster Project](http://theclusterproject.com/), 'an ongoing web gallery and blog that uses multimedia artworks to explore weapons, war, civilian casualties and pop culture.'

A React-based client to view, filter, and manipulate the data may be found [here](http://www.dronemappr.com/).

---

## API Endpoints

### Query Based Parameters

The Dronemappr API has a variety of optional query string based parameters. These may be used in isolation or in conjunction with the RESTful routes defined below.

All query based parameters are optional and may be mixed and matched at will onto the base root path of `/api/v1` or any of the additional routes defined below.

###### Path

    /api/v1/

###### Parameters

+ *country* - country name
+ *lat* - latitude
+ *lng* - longitude
+ *start_year* - starting year
+ *end_year* - starting year

###### Examples
    https://104.236.214.92:8443/api/v1/?country=syria
    https://104.236.214.92:8443/api/v1/?country=afghanistan&start_year=2014&end_year=2015

---

### All Data

Search and return all Dronemappr data.

###### Path

    /api/v1/

###### Parameters

+ *none* - no parameters required

###### Example
    https://104.236.214.92:8443/api/v1/

---

### By Country

Search and return all drone strikes within a specific country.

###### Path

    /api/v1/country/{country}

###### Parameters

+ *country* - country name

###### Example
    https://104.236.214.92:8443/api/v1/country/yemen

---

### By Casualties

Search and return for all drone strikes with *n* casualties.

###### Path

    /api/v1/kills/{kills}

###### Parameters

+ *kills* - number of casualties

###### Example
    https://104.236.214.92:8443/api/v1/kills/5

---

### By Date(s)

Searching by date can be done in three ways:

+ *Start Date* - Return all results _beginning_ at *start date* to present
+ *End Date* - Return all results _up until_ *end date*
+ *Date Range* - Return all results _between_ *start date* and *end date*

###### Path

    /api/v1/start_year/{start_year}/end_year/{end_year}

###### Parameters

+ *start_year* - starting year
+ *end_year* - ending year

###### Examples
    *Start Date Only*
    https://104.236.214.92:8443/api/v1/start_year/2015
    *End Date Only*
    https://104.236.214.92:8443/api/v1/end_year/2017
    *Date Range*
    https://104.236.214.92:8443/api/v1/start_year/2015/end_year/2016

---

### Strikes Within Distance (KM)

Search and return all drone strikes within a radius of *n* or more kilometers of a geographic coordinate (latitude , longitude).

###### Path

    /api/v1/radius/{radius}/lat/{lat}/lng/{lng}

###### Parameters

+ *radius* - radius (in kilometers)
+ *lat* - latitudinal point of origin
+ *lng* - longitudinal point of origin

###### Example
    https://104.236.214.92:8443/api/v1/radius/50/lat/33.566561/lng/69.878354

---


## Thanks

Special thanks to [Taq Karim](https://github.com/mottaquikarim) and Kirk Zamieroski for their continued support, input and all around savagely good vibes.

I'd also like to acknowledge preceding works for their subsequent influence on this project including Josh Begley's work [Dronestre.am](Dronestre.am), and [Out of Sight out of Mind](http://drones.pitchinteractive.com/).

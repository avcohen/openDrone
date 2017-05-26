const express = require('express');
const mapper = express.Router();
const API = require("./apikey.json");
const APIKEY = API.googleMaps;
const gmaps = require("@google/maps").createClient({
  key : APIKEY
});

module.exports = gmaps;

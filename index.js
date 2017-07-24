const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs')
const https = require('https');
const morgan = require('morgan');
const PORT = process.env.PORT || 8443;
const HOST = process.env.HOST || '';


// ROUTES
const api = require('./routes/api/api');
const apiVersion = 1

// MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// FIREBASE DB
const db = require("./firebase/firebase");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(`/api/v${apiVersion}`, api);

app.get('/', (req,res) => {
  res.send('VICTORRRRY!!!!');
});

Promise.resolve()
  .then(
      app.listen(PORT, HOST, null, function () {
              console.log('Server listening on port %d in %s mode', this.address().port, app.settings.env);
      })
  )
  .catch(err => console.error(err.stack));

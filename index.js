const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const port = 3001;

// ROUTES
const api = require('./routes/api/api');

// MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// FIREBASE DB
const db = require("./firebase/firebase");

app.use('/api', api);

app.get('/', (req,res) => {
  res.send('VICTORRRRY!!!!');
});


Promise.resolve()
  .then(app.listen(port))
  .catch(err => console.error(err.stack));

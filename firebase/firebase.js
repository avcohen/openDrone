const admin = require("firebase-admin");
const ServiceAccount = require("./opendrone-3f767-firebase-adminsdk-e7b4v-43db7e876b.json");
const credentials = { credential  : admin.credential.cert(ServiceAccount),
                      databaseURL : "https://opendrone-3f767.firebaseio.com" }
admin.initializeApp(credentials);

const db = admin.database();

module.exports = db;

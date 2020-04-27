const mongoose = require('mongoose');

var dotenv = require('dotenv');
dotenv.config();

 mongoose.Promise = global.Promise;
 
//  process.env.MONGOURI
const db_URL = process.env.DB_URI
mongoose.connect(db_URL, { useNewUrlParser: true ,useUnifiedTopology:true})
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error:'));
db.once('open', function () { console.log('Successfully connected to DB') });
// Dependencies
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');

// Init App
const app = express();
const PORT = process.env.PORT || 5000;


var passport   = require('passport');
var session    = require('express-session');

//Body Parser Middleware 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// For Passport
app.use(session({ secret: 'aG92ZX',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// User morgan to log all requests
app.use(logger('dev'));

// Init static assets
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('./client/build'));
}

// Init DB
//const db = process.env.MONGODB_URI || "mongodb://localhost/spacextest";
const db = require("./models");

// Connect to DB
/*mongoose.connect(db, { useNewUrlParser: true }, () => {
    console.log('Connected to mongoDB...');
}).catch(err => console.log(err));*/


// Auth Routes
require('./routes/auth-routes.js')(app,passport,express);


// Load passport strategies
require('./config/passport/passport.js')(passport,db.user);

//Import routes and give the server access to them.
require("./routes/api-routes.js")(app);
//require("./routes/html-routes.js")(app);


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});


// Start our server so that it can begin listening to client requests.
db.sequelize.sync({}).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});
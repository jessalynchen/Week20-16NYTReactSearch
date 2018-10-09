var createError = require('http-errors');
var express = require('express');
var path = require('path');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
const routes = require("./routes");
var logger = require('morgan');
const PORT = process.env.PORT || 3001;

const db = require('./models');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

if(process.env.NODE_ENV === "production")
{
    app.use(express.static("client/build"));
}

app.use(routes);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/reactnyt";
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/reactnyt");

mongoose.Promise = Promise;

app.listen(PORT, function () {
    console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
module.exports = app;
//  MONGODB_URI: mongodb://heroku_wbpscx3p:a08vkh3gdbab77ut0s2hb1qh0d@ds051960.mlab.com:51960/heroku_wbpscx3p
// Dependencies
var express = require("express"),
    bodyParser = require("body-parser"),
    logger = require("morgan"),
    mongoose = require("mongoose"),
    Note = require("./models/Note.js"),
    Article = require("./models/Article.js"),
    request = require("request"),
    cheerio = require("cheerio"),
    exphbs = require("express-handlebars"),
    app = express(),
    port = 3000;
mongoose.Promise = Promise;
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");


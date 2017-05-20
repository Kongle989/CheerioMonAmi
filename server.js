//  MONGODB_URI: mongodb://heroku_wbpscx3p:a08vkh3gdbab77ut0s2hb1qh0d@ds051960.mlab.com:51960/heroku_wbpscx3p
// Dependencies
var express = require("express"),
    bodyParser = require("body-parser"),
    logger = require("morgan"),
    mongoose = require("mongoose"),
    comments = require("./models/comments.js"),
    articles = require("./models/articles.js"),
    request = require("request"),
    cheerio = require("cheerio"),
    exphbs = require("express-handlebars"),
    app = express(),
    port = 3000;
app.use(logger("dev"));
app.use(bodyParser.urlencoded({extended: false}));
mongoose.Promise = Promise;
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");
mongoose.connect("mongodb://localhost/cheeriomonami");
var db = mongoose.connection;

var url = "http://www.muscleandfitness.com/athletes-celebrities/news";
app.get("/", function (req, res) {
res.render("index");
});
app.get("/scrape", function (req, res) {
    request(url, function (error, response, html) {
        var result = [];
        var $ = cheerio.load(html);
        $(".node__title").each(function (i, element) {
            var title = $(this).children().text().trim(),
                link = "http://www.muscleandfitness.com" + $(this).children().attr("href");
            result.push({
                title: title,
                link: link
            });
        });
        res.send(result);
    });
});


app.listen(port, function () {
    console.log("App running on port " + port);
});
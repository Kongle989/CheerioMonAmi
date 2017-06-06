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
app.use(express.static("public"));
mongoose.connect("mongodb://localhost/cheeriomonami");
var db = mongoose.connection;
db.on("error", function (error) {
    console.log("Mongoose Error: ", error);
});
db.once("open", function () {
    console.log("Mongoose connection successful.");
});
// DISPLAY ARTICLES IF ANY
var url = "http://www.muscleandfitness.com/athletes-celebrities/news";
app.get("/", function (req, res) {
    articles.find().sort({createdAt: 1}).exec(function (up, doc) {
        if (up) throw up;
        else res.render('index', {articles: doc});
    });
});
// DISPLAY SAVED ARTICLES IF ANY
app.get("/saved", function (req, res) {
    articles.find().sort({createdAt: 1}).exec(function (up, doc) {
        if (up) throw up;
        else res.render('saved', {articles: doc});
    });
});
// SCRAPE FOR CURRENT ARTICLES
app.get("/scrape", function (req, res) {
    request(url, function (error, response, html) {
        var $ = cheerio.load(html);
        $(".node__title").each(function (i, element) {
            var title = $(this).children().text().trim(),
                link = "http://www.muscleandfitness.com" + $(this).children().attr("href");
            articles.findOneAndUpdate(
                {title: title},
                {
                    title: title,
                    link: link,
                },
                {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true
                }, function (up, doc) {
                    if (up) throw up;
                })
        });
        res.redirect('/')
    });
});
// SAVE AN ARTICLE
app.get('/save/:id', function (req, res) {
    articles.findByIdAndUpdate(req.params.id,
        {saved: true}
        , function (up, doc) {
            if (up) throw up;
            else res.redirect('/');
        })
});
// UNSAVE AN ARTICLE
app.get('/unsave/:id', function (req, res) {
    articles.findByIdAndUpdate(req.params.id,
        {
            saved: false,
            comment: []
        }
        , function (up, doc) {
            comments.remove({_id: doc.comment}, function (up, doc) {
                if (up) throw up;
                else res.redirect('/saved');
            });

        })
});
// ADD COMMENT
app.post('/addComment/:id', function (req, res) {
    var newComment = new comments({
        body: req.body.comment.trim()
    });
    newComment.save(function (up, doc) {
        if (up) throw up;
        else {
            articles.findByIdAndUpdate(req.params.id,
                {
                    $push: {
                        'comment': doc._id
                    }
                }, {new: true}, function (up, newdoc) {
                    if (up) throw up;
                    else {
                        res.redirect('/saved');
                    }
                })
        }
    })
});
// DISPLAY COMMENT
app.get('/getComment/:id', function (req, res) {
    articles.findById(req.params.id)
        .populate('comment')
        .exec(function (up, doc) {
            if (up) throw up;
            else res.send(doc);
        })
});
// SEND ALL BAD URL TO INDEX
app.get('*', function (req, res) {
    res.redirect('/');
});

app.listen(port, function () {
    console.log("App running on port " + port);
});

mongoose.connect('mongodb://heroku_wbpscx3p:a08vkh3gdbab77ut0s2hb1qh0d@ds051960.mlab.com:51960/heroku_wbpscx3p');
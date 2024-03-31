const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("article", articleSchema);

app.route("/articles")
    .get(function(req, res) {
        run();
        async function run() {
            const foundArticles = await Article.find().catch(function(e) {
                res.send(e);
            });
            res.send(foundArticles);
        }
    })

    .post(function(req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save().then(function() {
            res.send("Successfully saved the new article.");
        }).catch(function(e) {
            res.send(e);
        });
    })

    .delete(function(req, res) {
        Article.deleteMany().then(function() {
            res.send("Deleted all articles.");
        }).catch(function(e) {
            res.send(e);
        });
    });

app.route("/articles/:articleTitle")

    .get(function(req, res) {
        Article.findOne({title: req.params.articleTitle})
            .then(function(foundArticle) {
                res.send(foundArticle);
            })
            .catch(function(e) {
                res.send(e);
            });
    })

    .put(function(req, res){
        Article.replaceOne(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content}
        ).then(function(){
            res.send("Update successful");
        }, function(e){
            res.send("Error: " + e);
        });
    })

    .patch(function(req, res){
        Article.updateOne(
            {title: req.params.articleTitle},
            req.body
        ).then(function(){
            res.send("Update successful");
        }, function(err){
            res.send(err);
        });
    })

    .delete(function(req, res){
        Article.deleteOne({title: req.params.articleTitle})
        .then(function(){
            res.send("Deleted");
        }, function(err){
            res.send(err);
        });
    })

app.listen(3000, function() {
    console.log("Server running on port 3000");
});

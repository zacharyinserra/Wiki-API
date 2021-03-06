//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb+srv://zac:nonsense66@todolist-v2.nwiqg.mongodb.net/wikiDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true
})

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

// REQUESTS TARGETING ALL ARTICLES //
app.route("/articles")

  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err) {
      if (!err) {
        res.send("New article added.");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("All articles deleted.");
      } else {
        res.send(err);
      }
    })
  });



// REQUESTS TARGETING A SPECIFIC ARTICLE //
app.route("/articles/:articleTitle")

  .get(function(req, res) {
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles found.");
      }
    });
  })

  .put(function(req, res) {
    Article.update(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err) {
        if (!err) {
          res.send(req.params.articleTitle + " updated.");
        }
      }
    );
  })

  .patch(function(req, res) {
    Article.update(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err) {
        if (!err) {
          res.send(req.params.articleTitle + " patched.");
        }
      }
    );
  })

  .delete(function(req, res) {
    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err) {
        if (!err) {
          res.send(req.params.articleTitle + " deleted.");
        } else {
          res.send(err);
        }
      }
    );
  });

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});

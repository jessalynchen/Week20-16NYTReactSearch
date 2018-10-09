const db = require("../models");

module.exports = {
    create: (req, res) => {
        const article = {
            title: req.body.title,
            url: req.body.url,
            date: req.body.date,
            savedDate: req.body.savedDate
        };
        db.Article
            .create(article)
            .then(dbArticle => res.json(dbArticle))
            .catch(err => res.status(422).json(err));
    },
    findAll: (req, res) => {
        db.Article
         .find(req.query)
         .then(dbArticle => res.json(dbArticle))
         .catch(err => res.status(422).json(err));
    },
    delete: (req, res) => {
        db.Article
         .findById({_id: req.params.id})
         .then(dbModel => dbModel.remove())
         .then(dbModel => res.json(dbModel))
         .catch(err => res.status(422).json(err))
    }
};
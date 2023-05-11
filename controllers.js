const {
  selectCategories,

  findReviewByID,
  postReviewComment,

  selectReviews,

  findCommentsByRevID,

} = require("./models");
const endpoints = require("./endpoints.json");
const reviews = require("./db/data/test-data/reviews");

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};

exports.getReviewByID = (req, res, next) => {
  const id = req.params;
  findReviewByID(id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};
exports.getEndpoints = (req, res, next) => {
  res.status(200).send({ endpoints });
};


exports.postReviewCommentById = (req, res, next) => {
  const id = req.params;
  const data = req.body;
  postReviewComment(id, data)
    .then((commentData) => {
      res.status(201).send({ commentData });
    })
    .catch(next);
};

exports.getCommentsByRevID = (req, res, next) => {
  const id = req.params;
  findCommentsByRevID(id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  selectReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};


const {
  selectCategories,
  findReviewByID,
  findCommentsByRevID,
} = require("./models");
const endpoints = require("./endpoints.json");

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

exports.getCommentsByRevID = (req, res, next) => {
  const id = req.params;
  findCommentsByRevID(id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

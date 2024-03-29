const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const {
  getCategories,
  getReviewByID,
  getEndpoints,
  postReviewCommentById,
  getCommentsByRevID,
  getReviews,
  patchReviewVotesByRevID,
  getUsers,
  deleteCommentById,

} = require("./controllers");

app.get("/api", getEndpoints);
app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewByID);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id/comments", getCommentsByRevID);
app.post("/api/reviews/:review_id/comments", postReviewCommentById);
app.patch("/api/reviews/:review_id", patchReviewVotesByRevID);
app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getUsers);

app
  .use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else next(err);
  })
  .use((err, req, res, next) => {
    if (err.code === "22P02") {
      res.status(400).send({ msg: "Invalid Input" });
    } else next(err);
  })
  .use((err, req, res, next) => {
    if (err.code === "23503") {
      res.status(404).send({ msg: "Review or user not found" });
    } else next(err);
  })
  .use((req, res, next) =>
    res.status(404).send({ msg: "Sorry can't find that!" })
  );
module.exports = app;

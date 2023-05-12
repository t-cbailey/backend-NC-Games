const { checkExists } = require("./app_utils");
const connection = require("./db/connection");

exports.selectCategories = () => {
  return connection.query(`SELECT * FROM categories;`).then((res) => {
    return res.rows;
  });
};

exports.selectReviews = () => {
  return connection
    .query(
      `SELECT owner, title, category, review_img_url, reviews.created_at, reviews.votes, designer,reviews.review_id, COUNT (comments.review_id) AS comment_count FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at ASC;`
    )
    .then((res) => {
      return res.rows;
    });
};

exports.findReviewByID = (id) => {
  const arr = [id.review_id];
  return connection
    .query(`SELECT * FROM reviews WHERE review_id = $1`, arr)
    .then((res) => {
      return res.rows.length === 0
        ? Promise.reject({ status: 404, msg: "Nothing Found!" })
        : res.rows;
    });
};

exports.postReviewComment = (id, data) => {
  const review_id = parseInt(id.review_id);
  const { username, body } = data;
  if (
    !data.hasOwnProperty("username") ||
    !data.hasOwnProperty("body") ||
    typeof data.body !== "string" ||
    Object.keys(data).length > 2
  ) {
    return Promise.reject({ status: 400, msg: "Unsupported body format" });
  } else {
    return connection
      .query(
        `INSERT INTO comments (author, body, review_id) VALUES ($1, $2, $3) RETURNING *`,
        [username, body, review_id]
      )
      .then((res) => {
        return res.rows;
      });
  }
};

exports.findCommentsByRevID = (id) => {
  const table = "reviews";
  const column = "review_id";
  review_id = parseInt(id.review_id);

  return Promise.all([
    checkExists(table, column, review_id),
    connection.query(
      `SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.review_id FROM reviews 
  JOIN comments ON comments.review_id = reviews.review_id
  WHERE reviews.review_id = $1
  ORDER BY comments.created_at;`,
      [review_id]
    ),
  ]).then(([unusedCHKESTS, dbOutput]) => {
    return dbOutput.rows;
  });
};

exports.patchReviewVotes = (id, votes) => {
  if (!votes.hasOwnProperty("inc_votes") || Object.keys(votes).length > 1) {
    return Promise.reject({ status: 400, msg: "Unsupported body format" });
  } else {
    return Promise.all([
      checkExists("reviews", "review_id", id),
      connection.query(
        `UPDATE reviews
      SET votes = votes + $2
      WHERE review_id = $1 RETURNING *`,
        [id, votes.inc_votes]
      ),
    ]).then(([unusedCHKESTS, dbOutput]) => {
      return dbOutput.rows;
    });
  }
};
exports.findUsers = () => {
  return connection.query(`SELECT * FROM users;`).then((users) => {
    return users.rows;
  });
};

const db = require('./db');

module.exports = {
  getReviews: function (req, res) {
    let product_id = req.query.product_id || 1;
    let sort = req.query.sort || 'relevant';
    let page = req.query.page || 1;
    let count = req.query.count || 5;
    let queryString;

    if (sort === 'newest') {
      queryString = `SELECT *,
      (SELECT COALESCE (json_agg((photos)), '[]'::json) FROM photos where review_id = reviews.id) AS photos
      FROM reviews WHERE product_id = ${product_id} AND reported = false ORDER BY date DESC OFFSET ${(count * page) - count} LIMIT ${count}`;

    } else if (sort === 'helpful') {
      queryString = `SELECT *,
      (SELECT COALESCE (json_agg(photos), '[]'::json) FROM photos where review_id = reviews.id) AS photos
      FROM reviews WHERE product_id = ${product_id} AND reported = false ORDER BY helpfulness DESC OFFSET ${(count * page) - count} LIMIT ${count}`;

    } else {
      queryString = `SELECT *,
      (SELECT COALESCE (json_agg(photos), '[]'::json) FROM photos where review_id = reviews.id) AS photos
      FROM reviews WHERE product_id = ${product_id} AND reported = false ORDER BY helpfulness DESC, date DESC OFFSET ${(count * page) - count} LIMIT ${count}`;
    }

    db.query(queryString)
      .then(result => {
        res.send({
          'product': product_id,
          'page': page,
          'count': count,
          'results': result.rows
        });
      })
      .catch(err => {
        console.log(err);
      });
  },

  getMetaData: async (req, res) => {
    let product_id = req.query.product_id || 1;

    let ratingQuery = `SELECT COUNT(rating) AS "5",
      (SELECT COUNT(rating) AS "4"  FROM reviews WHERE product_id = ${product_id} AND rating = 4),
      (SELECT COUNT(rating) AS "3"  FROM reviews WHERE product_id = ${product_id} AND rating = 3),
      (SELECT COUNT(rating) AS "2"  FROM reviews WHERE product_id = ${product_id} AND rating = 2),
      (SELECT COUNT(rating) AS "1"  FROM reviews WHERE product_id = ${product_id} AND rating = 1)
      FROM reviews WHERE product_id = ${product_id} AND rating = 5`;

    let characteristicsQuery = `SELECT name, id,
    (SELECT AVG(value) FROM characteristic_reviews WHERE characteristic_id = characteristics.id) AS average
    FROM characteristics WHERE product_id = ${product_id}`;

    let recommendQueryTrue = `SELECT COUNT(recommend) AS true, (SELECT COUNT(recommend) as false FROM reviews WHERE product_id = ${product_id} AND recommend = false) FROM reviews WHERE product_id = ${product_id} AND recommend = true`;

    let ratingsData = await db.query(ratingQuery);
    let characteristicsData = await db.query(characteristicsQuery);
    let recommendData = await db.query(recommendQueryTrue);

    characteristicsObj = {};

    characteristicsData.rows.forEach(function(item) {
      characteristicsObj[item.name] = {id: item.id, value: item.average};
    })

    res.send({
      product_id: product_id,
      ratings: ratingsData.rows[0],
      characterisctics: characteristicsObj,
      recommended: recommendData.rows[0]
    })
  },

  updateHelpful: function (req, res) {
    let review_id = req.params.review_id;

    let queryString = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = ${review_id}`;

    db.query(queryString)
      .then(result => {
        res.send();
      })
      .catch(err => {
        console.log(err)
      });
  },

  updateReport: function (req, res) {
    let review_id = req.params.review_id;

    let queryString = `UPDATE reviews SET reported = true WHERE id = ${review_id}`;

    db.query(queryString)
      .then(result => {
        res.send();
      })
      .catch(err => {
        console.log(err)
      });
  },

  createReview: function (req, res) {
    let reviewsPostQuery = 'INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
    let postParams = [req.body.product_id, req.body.rating, 'NOW()', req.body.summary, req.body.body, req.body.recommend, req.body.reviewer_name, req.body.reviewer_email];
    console.log(postParams)

    db.query(reviewsPostQuery, postParams)
      .then(result => {
        res.send();
      })
      .catch(err => {
        console.log(err)
      });
  }
};
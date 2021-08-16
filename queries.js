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
      FROM reviews WHERE product_id = ${product_id} ORDER BY date DESC OFFSET ${(count * page) - count} LIMIT ${count}`;

    } else if (sort === 'helpful') {
      queryString = `SELECT *,
      (SELECT COALESCE (json_agg(photos), '[]'::json) FROM photos where review_id = reviews.id) AS photos
      FROM reviews WHERE product_id = ${product_id} ORDER BY helpfulness DESC OFFSET ${(count * page) - count} LIMIT ${count}`;

    } else {
      queryString = `SELECT *,
      (SELECT COALESCE (json_agg(photos), '[]'::json) FROM photos where review_id = reviews.id) AS photos
      FROM reviews WHERE product_id = ${product_id} ORDER BY helpfulness DESC, date DESC OFFSET ${(count * page) - count} LIMIT ${count}`;
    }

    db.query(queryString)
      .then(result => {
        res.send(result.rows);
      })
      .catch(err => {
        console.log(err);
      });
  },

  getMetaData: function (req, res) {
    let product_id = req.query.product_id || 1;
    var ratingsResults;
    var product_idResult;
    var characteristicsResults;
    charObj = {};
    var recommendObj = {};
    var responseObj = {};

    var product_idQuery = `SELECT product_id FROM reviews WHERE product_id = ${product_id} limit 1`;

    var ratingQuery = `SELECT COUNT(rating) AS "5",
    (SELECT COUNT(rating) AS "4"  FROM reviews WHERE product_id = ${product_id} AND rating = 4),
    (SELECT COUNT(rating) AS "3"  FROM reviews WHERE product_id = ${product_id} AND rating = 3),
    (SELECT COUNT(rating) AS "2"  FROM reviews WHERE product_id = ${product_id} AND rating = 2),
    (SELECT COUNT(rating) AS "1"  FROM reviews WHERE product_id = ${product_id} AND rating = 1)
    FROM reviews WHERE product_id = ${product_id} AND rating = 5`;

    var characteristicsQuery = `SELECT name, id,
    (SELECT AVG(value) FROM characteristic_reviews WHERE characteristic_id = characteristics.id) AS average
    FROM characteristics WHERE product_id = ${product_id}`;

    var recommendQueryTrue = `SELECT COUNT(recommend) FROM reviews WHERE product_id = ${product_id} AND recommend = true`;
    var recommendQueryFalse = `SELECT COUNT(recommend) FROM reviews WHERE product_id = ${product_id} AND recommend = false`;


    db.query(product_idQuery)
      .then(result => {
        if (result.rows[0]) {
          responseObj.product_id = result.rows[0].product_id;
          db.query(ratingQuery)
            .then(newResult => {
              responseObj.ratings = newResult.rows[0];
              db.query(characteristicsQuery)
                .then(charResult => {
                  charResult.rows.forEach(function (characteristic) {
                    charObj[characteristic.name] = { "id": characteristic.id, "value": characteristic.average } || {};
                  })
                  responseObj.characteristics = charObj;
                  db.query(recommendQueryTrue)
                    .then(trueResult => {
                      recommendObj['true'] = trueResult.rows[0].count;
                      db.query(recommendQueryFalse)
                        .then(falseResult => {
                          recommendObj['false'] = falseResult.rows[0].count;
                          responseObj.recommended = recommendObj;
                        })
                        .then(result => {
                          res.send(responseObj);
                        })
                    })
                })
            });
        } else {
          // if there are no reviews and no metadata for this object
          res.send({});
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
};
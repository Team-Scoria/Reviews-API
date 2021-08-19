const express = require('express');
const db = require('./db');
const loader = require('./loader_config.txt')
const port = 3000;
const app = express();

const {getReviews, getMetaData, updateHelpful, updateReport, createReview} = require('./queries');

app.use(express.json());

app.get('/reviews', getReviews);

app.get('/reviews/meta', getMetaData);

app.put('/reviews/:review_id/helpful', updateHelpful);

app.put('/reviews/:review_id/report', updateReport);

app.post('/reviews', createReview);

app.get('/loaderio-7298e7b27c163fb6fe7bdddb47850c60.txt', (req, res) => {
  res.send(loader);
});

app.listen(port, function() {
  console.log('Listening on port 3000');
});
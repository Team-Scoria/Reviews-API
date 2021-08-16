DROP TABLE IF EXISTS Reviews CASCADE;

CREATE TABLE Reviews (
  id INTEGER NOT NULL,
  product_id INTEGER NULL DEFAULT NULL,
  rating INTEGER NULL DEFAULT NULL,
  date BIGINT DEFAULT NULL,
  summary VARCHAR NULL DEFAULT NULL,
  body TEXT NULL DEFAULT NULL,
  recommend BOOLEAN NOT NULL DEFAULT FALSE,
  ss BOOLEAN NULL DEFAULT NULL,
  reviewer_name VARCHAR NULL DEFAULT NULL,
  reviewer_email VARCHAR NULL DEFAULT NULL,
  response VARCHAR NULL DEFAULT NULL,
  helpfulness INTEGER NULL DEFAULT NULL,
  PRIMARY KEY (id)
);

COPY reviews (id, product_id, rating, date, summary, body, recommend, ss, reviewer_name, reviewer_email, response, helpfulness) FROM '/Users/shannamurry/Desktop/Reviews-API/sdc-data/data/reviews.csv' DELIMITER ',' CSV HEADER;

DROP TABLE IF EXISTS Photos;

CREATE TABLE Photos (
  id INTEGER NOT NULL,
  review_id INTEGER REFERENCES reviews (id),
  url VARCHAR NULL DEFAULT NULL,
  PRIMARY KEY (id)
);

COPY photos (id, review_id, url) FROM '/Users/shannamurry/Desktop/Reviews-API/sdc-data/data/reviews_photos.csv' DELIMITER ',' CSV HEADER;

DROP TABLE IF EXISTS Characteristics CASCADE;

CREATE TABLE Characteristics (
  id INTEGER NOT NULL,
  product_id INTEGER DEFAULT NULL,
  name VARCHAR NULL DEFAULT NULL,
  PRIMARY KEY (id)
);

COPY characteristics (id, product_id, name) FROM '/Users/shannamurry/Desktop/Reviews-API/sdc-data/data/characteristics.csv' DELIMITER ',' CSV HEADER;

DROP TABLE IF EXISTS Characteristics_Reviews;

CREATE TABLE Characteristic_Reviews (
  id INTEGER NOT NULL,
  characteristic_id INTEGER REFERENCES characteristics (id),
  review_id INTEGER REFERENCES reviews (id),
  value NUMERIC NULL DEFAULT NULL,
  PRIMARY KEY (id)
);

COPY characteristic_reviews (id, characteristic_id, review_id, value) FROM '//Users/shannamurry/Desktop/Reviews-API/sdc-data/data/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;

alter table reviews
alter date type date using (to_timestamp(date/1000));

CREATE INDEX product ON reviews USING hash (product_id);
CREATE INDEX characteristic ON characteristic_reviews USING hash (characteristic_id);
CREATE INDEX date ON reviews USING hash (date);
CREATE INDEX photo ON photos USING hash (review_id);

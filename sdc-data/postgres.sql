-- DROP TABLE IF EXISTS Reviews CASCADE;
-- DROP TABLE IF EXISTS Photos;
-- DROP TABLE IF EXISTS Characteristics;
-- DROP TABLE IF EXISTS Characteristics_Reviews;

-- CREATE TABLE IF NOT EXISTS Reviews (
--   id SERIAL,
--   product_id INTEGER NULL DEFAULT NULL,
--   rating INTEGER NULL DEFAULT NULL,
--   date BIGINT DEFAULT NULL,
--   summary VARCHAR NULL DEFAULT NULL,
--   body TEXT NULL DEFAULT NULL,
--   recommend BOOLEAN NOT NULL DEFAULT FALSE,
--   ss BOOLEAN NULL DEFAULT false,
--   reviewer_name VARCHAR NULL DEFAULT NULL,
--   reviewer_email VARCHAR NULL DEFAULT NULL,
--   response VARCHAR NULL DEFAULT NULL,
--   helpfulness INTEGER NULL DEFAULT 0,
--   PRIMARY KEY (id)
-- );

-- CREATE TABLE IF NOT EXISTS Photos (
--   id SERIAL,
--   review_id INTEGER REFERENCES reviews (id),
--   url VARCHAR NULL DEFAULT NULL,
--   PRIMARY KEY (id)
-- );

-- CREATE TABLE IF NOT EXISTS Characteristics (
--   id SERIAL,
--   product_id INTEGER DEFAULT NULL,
--   name VARCHAR NULL DEFAULT NULL,
--   PRIMARY KEY (id)
-- );

-- CREATE TABLE IF NOT EXISTS Characteristic_Reviews (
--   id SERIAL,
--   characteristic_id INTEGER REFERENCES characteristics (id),
--   review_id INTEGER REFERENCES reviews (id),
--   value NUMERIC NULL DEFAULT NULL,
--   primary key (id)
-- );

-- COPY reviews (id, product_id, rating, date, summary, body, recommend, ss, reviewer_name, reviewer_email, response, helpfulness) FROM '/Users/shannamurry/Desktop/Reviews-API/Reviews-API/sdc-data/data/reviews.csv' DELIMITER ',' CSV HEADER;

-- COPY photos (id, review_id, url) FROM '/Users/shannamurry/Desktop/Reviews-API/Reviews-API/sdc-data/data/reviews_photos.csv' DELIMITER ',' CSV HEADER;

-- COPY characteristics (id, product_id, name) FROM '/Users/shannamurry/Desktop/Reviews-API/Reviews-API/sdc-data/data/characteristics.csv' DELIMITER ',' CSV HEADER;

-- COPY characteristic_reviews (id, characteristic_id, review_id, value) FROM '/Users/shannamurry/Desktop/Reviews-API/Reviews-API/sdc-data/data/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;

-- ALTER TABLE reviews
-- ALTER date TYPE date USING (to_timestamp(date/1000));

-- ALTER TABLE reviews
-- ADD COLUMN IF NOT EXISTS reported BOOLEAN DEFAULT FALSE;

-- CREATE INDEX product ON reviews USING hash (product_id);
-- CREATE INDEX characteristic ON characteristic_reviews USING hash (characteristic_id);
-- CREATE INDEX date ON reviews USING hash (date);
-- CREATE INDEX photo ON photos USING hash (review_id);
-- CREATE INDEX characteristics_product ON characteristics USING hash (product_id);
-- create index reviews_id on reviews using hash (id);

-- SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM reviews)+1);
-- SELECT setval('photos_id_seq', (SELECT MAX(id) FROM photos)+1);
-- SELECT setval('characteristic_reviews_id_seq', (SELECT MAX(id) FROM characteristic_reviews)+1);
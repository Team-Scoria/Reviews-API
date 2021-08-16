const { Pool, Client } = require('pg');

const db = new Pool({
  user: 'shannamurry',
  host: '127.0.0.1',
  database: 'reviews',
  password: '',
  port: 5432
});

db.connect(() => {
  console.log(`Connected to ${db.options.database} database on port ${db.options.port}`);
});

module.exports = db;
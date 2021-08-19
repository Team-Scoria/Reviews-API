const { Pool, Client } = require('pg');

const db = new Pool({
  user: 'ubuntu',
  host: 'http://ec2-3-84-218-185.compute-1.amazonaws.com',
  database: 'postgres',
  password: 'belljar84',
  port: 5432
});

db.connect(() => {
  console.log(`Connected to ${db.options.database} database on port ${db.options.port}`);
});

module.exports = db;
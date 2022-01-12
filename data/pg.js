'use strict';

const { Pool, Client } = require('pg')
const pool = new Pool({
  user: 'nodejs_service_user',
  host: 'localhost',
  database: 'postgres',
  password: 'Writeback@123',
  port: 5432
})


module.exports = pool;
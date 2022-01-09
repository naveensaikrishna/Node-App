const { Pool, Client } = require('pg')
const pool = new Pool({
  user: 'nrkntobeikkeno',
  host: 'ec2-3-230-219-251.compute-1.amazonaws.com',
  database: 'd4vqr6fvrcoio9',
  password: '66acfc7ffcecc0073efe9caa314841145ef8908bd62fdd22b07a8871804d5a08',
  port: 5432,
  ssl:true
})


module.exports = pool;
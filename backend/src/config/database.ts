import { Pool } from 'pg'

const pool = new Pool({
  user: 'jokeice',
  host: 'localhost',
  database: 'jumptech_db',
  password: '',
  port: 5432,
})

export default pool
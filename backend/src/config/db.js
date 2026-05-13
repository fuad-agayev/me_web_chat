
import pkg from 'pg';
import { env } from './env.js';
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: env.DB_URL
});


pool.connect()
  .then((client) => {
    console.log('DB connected');

    return client.query('SELECT NOW()');
  })
  .then((res) => {
    console.log('Database time:', res.rows[0].now);
  })
  .catch((err) => {
    console.log('DB ERROR:', err.message);
  });

    //  WHY CHOOSE  -connect or  -query?
  //👉 connect() connection açar ama kapatmaz
//👉 query() daha temiz ✔
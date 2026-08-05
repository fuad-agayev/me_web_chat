
import pkg from 'pg';
import { env } from './env.js';
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: env.DB_URL,
     ssl: { rejectUnauthorized: false }
});

// Pool error handling
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Sadə test sorğusu
pool.query('SELECT NOW()')
  .then(res => {
    console.log('DB connected');
    console.log('Database time:', res.rows[0].now);
  })
  .catch(err => {
    console.error('DB ERROR:', err.message);
  });


// pool.connect()
//   .then((client) => {
//     console.log('DB connected');

//     return client.query('SELECT NOW()');
//   })
//   .then((res) => {
//     console.log('Database time:', res.rows[0].now);
//   })
//   .catch((err) => {
//     console.log('DB ERROR:', err.message);
//   });

    //  WHY CHOOSE  -connect or  -query?
  //👉 connect() connection açar ama kapatmaz
//👉 query() daha temiz ✔
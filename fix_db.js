import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'server', 'erp.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error(err);
  else {
    // Force admin user to have admin role
    db.run("UPDATE users SET role = 'admin' WHERE email = 'admin@erp.com'", (err) => {
      if (err) console.error('Error updating admin role', err);
      else console.log('Admin role restored on admin@erp.com');
      
      // Print plans
      db.all("SELECT * FROM plans", (err, rows) => {
        console.log('PLANS:', rows);
        
        // Print users
        db.all("SELECT * FROM users", (err, users) => {
          console.log('USERS:', users.map(u => ({ id: u.id, email: u.email, role: u.role })));
        });
      });
    });
  }
});

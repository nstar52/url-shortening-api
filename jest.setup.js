const path = require('path');
const fs = require('fs');

process.env.DATABASE_PATH = path.join(process.cwd(), 'urls.test.db');
if (fs.existsSync(process.env.DATABASE_PATH)) {
  fs.unlinkSync(process.env.DATABASE_PATH);
}

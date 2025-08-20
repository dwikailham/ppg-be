import db from '../config/db';
import '../models';

(async () => {
  try {
    await db.sync({ alter: true });
    console.log('Synced databases!');
  } catch (err) {
    console.error('Failed to sync DB:', err);
  }
})();

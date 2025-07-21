import { JSONFileSync, LowSync } from 'lowdb';

const adapter = new JSONFileSync('./db.json');
export const db = new LowSync(adapter);
db.read();
db.data ||= { users: {} };

/** helpers */
export const getState = uid => db.data.users[uid] || {};
export const setState = (uid, patch) => {
  db.data.users[uid] = { ...getState(uid), ...patch };
  db.write();
};
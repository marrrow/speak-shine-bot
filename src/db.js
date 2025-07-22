// src/db.js
import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';

const adapter = new JSONFileSync('./db.json');
export const db = new LowSync(adapter, { users: {} });
db.read();

export function getState(uid) {
  return db.data.users[uid] || {};
}

export function setState(uid, patch) {
  db.data.users[uid] = { ...getState(uid), ...patch };
  db.write();
}

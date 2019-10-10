import config from '../config';
import fs from 'fs';
import path from 'path';

// TODO: Add gzip support if these get too big

// Map of all loaded databases
type DB = FlatMap<any>;

const map: FlatMap<DB> = {};
const proxies: FlatMap<DB> = {};
const lastSync: FlatMap<Date> = {};

type SuccessFn = (name: string) => void;
type ErrorFn = (name: string, err: NodeJS.ErrnoException) => void;

// Saves a specific DB to disk
export const saveDb = (
  name: string,
  cbSuccess?: SuccessFn,
  cbError?: ErrorFn
) => {
  const p = path.resolve(config.db.path, `${name}.json`);

  // important to set it here to avoid multiple syncs
  lastSync[name] = new Date();

  fs.writeFile(p, JSON.stringify(map[name]), 'utf8', err => {
    if (err) {
      console.error(`[localdb] Error saving database ${name}`);
      console.error(err);

      typeof cbError === 'function' && cbError(name, err);
    }

    typeof cbSuccess === 'function' && cbSuccess(name);
  });
};

// Loads a DB from disk
export const loadDb = (name: string) => {
  let db = {};
  const p = path.resolve(config.db.path, `${name}.json`);

  console.log(`[localdb] Loading ${name}`);

  try {
    const raw = fs.readFileSync(p, 'utf8');
    db = JSON.parse(raw);
  } catch (e) {
    if (e.code !== 'ENOENT') {
      console.error(`[localdb] Error reading database ${name}`);
      console.error(e);
    }

    // File not found should be handled
    console.warn(`[localdb] Empty ${name} has been initialized`);
    db = {};
  }

  map[name] = db;
  proxies[name] = new Proxy(map[name], {
    set: (_, prop, value) => {
      if (typeof prop !== 'string') return false;

      map[name][prop] = value;

      const diff = +new Date() - +lastSync[name];
      if (diff > config.db.syncInterval * 1000) {
        saveDb(name);
      }

      return true;
    },
  });

  lastSync[name] = new Date();
};

// Saves all DBs to disk
export const syncToDisk = (cbSuccess: SuccessFn, cbError: ErrorFn) => {
  const keys = Object.keys(map);

  keys.forEach(key => {
    saveDb(key, cbSuccess, cbError);
  });

  return keys;
};

// Gets a DB
export const getDb = (name: string) => {
  if (!map[name] || !proxies[name]) {
    loadDb(name);
  }

  return proxies[name];
};

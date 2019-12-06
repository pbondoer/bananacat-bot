import config from '~/config';
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

export const dbPath = (name: string) =>
  path.resolve(config.db.path, `${name}.json`);

// Saves a specific DB to disk
export const saveDb = (
  name: string,
  cbSuccess?: SuccessFn,
  cbError?: ErrorFn
) => {
  // important to set it here to avoid multiple syncs
  lastSync[name] = new Date();

  // ensure the folder is present
  if (!fs.existsSync(config.db.path)) {
    fs.mkdirSync(config.db.path);
  }

  fs.writeFile(dbPath(name), JSON.stringify(map[name]), 'utf8', err => {
    if (err) {
      console.error(`[localdb] Error saving database ${name}`);
      console.error(err);

      cbError && cbError(name, err);
      return;
    }

    cbSuccess && cbSuccess(name);
  });
};

// Loads a DB from disk
export const loadDb = (name: string) => {
  let db = {};

  console.log(`[localdb] Loading ${name}`);

  try {
    const raw = fs.readFileSync(dbPath(name), 'utf8');
    db = JSON.parse(raw);
  } catch (e) {
    if (e.code !== 'ENOENT') {
      console.error(`[localdb] Error reading database ${name}`);
      console.error(e);
      return;
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

// Check if a DB exists
export const hasDb = (name: string) => fs.existsSync(dbPath(name));

// Saves all DBs to disk
export const syncToDisk = (cbSuccess: SuccessFn, cbError: ErrorFn) => {
  const keys = Object.keys(map);

  keys.forEach(key => {
    saveDb(key, cbSuccess, cbError);
  });

  return keys;
};

// List of all DBs
export const listDb = () => Object.keys(map);

// Stats
export const dbStats = (name: string) => {
  return {
    count: Object.keys(map[name]).length,
    size: fs.statSync(dbPath(name)).size,
    lastWrite: lastSync[name],
  };
};

// Gets a DB
export const getDb = (name: string) => {
  if (!map[name] || !proxies[name]) {
    loadDb(name);
  }

  return proxies[name];
};

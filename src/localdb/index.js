import config from "../config";
import fs from 'fs';
import path from 'path';

// Map of all loaded databases
const map = {};
const proxies = {};
const lastSync = {};

// Loads a DB from disk
export const loadDb = (name) => {
    let db = {};
    const p = path.resolve(config.db.path, `${name}.json`);

    console.error(`[localdb] Loading ${name}`);

    try {
        const raw = fs.readFileSync(p, 'utf8');
        db = JSON.parse(raw);
    } catch (e) {
        if (e.code !== 'ENOENT') {
            console.error(`[localdb] Error reading database ${name}`);
            console.error(e);
        }

        // File not found should be handled
        console.error(`[localdb] Empty ${name} has been initialized`);
        db = {};
    }

    map[name] = db;
    proxies[name] = new Proxy(map[name], {
        set: (obj, prop, value) => {
            map[name][prop] = value;

            const diff = new Date() - lastSync[name];
            if (diff > config.db.syncInterval * 1000) {
                saveDb(name);
            }

            return true;
        }
    });
    lastSync[name] = new Date();
}

// Saves a specific DB to disk
export const saveDb = (name, cbSuccess, cbError) => {
    const p = path.resolve(config.db.path, `${name}.json`);

    // important to set it here to avoid multiple syncs
    lastSync[name] = new Date();

    fs.writeFile(p, JSON.stringify(map[name]), 'utf8', (err) => {
        if (err) {
            console.error(`[localdb] Error saving database ${name}`);
            console.error(err);

            typeof cbError === 'function' && cbError(name, err);
        }

        typeof cbSuccess === 'function' && cbSuccess(name);
    });
}

// Saves all DBs to disk
export const syncToDisk = (cbSuccess, cbError) => {
    const keys = Object.keys(map);

    keys.forEach(key => {
        saveDb(key, cbSuccess, cbError);
    })

    return keys;
}

// Gets a DB
export const getDb = (name) => {
    if (!map[name] || !proxies[name]) {
        loadDb(name);
    }

    return proxies[name];
}

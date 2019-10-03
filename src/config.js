import path from 'path';

import raw from "../config";

// This module allows us to edit properties after loading config if needed

// utility functions
const array = (item) => Array.isArray(item) ? item : [];

const config = Object.freeze({
    ...raw,
    prefix: raw.prefix || '!',
    admins: array(raw.admins),
    db: {
        ...raw.db,
        path: path.resolve(raw.db.path),
    }
})

if (!config.token) {
    console.warn("No token in config!")
}

export default config;

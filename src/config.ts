import _path from 'path';

import raw from '../config';

// This module allows us to edit properties after loading config if needed

// utility functions
const array = (item: any) => (Array.isArray(item) ? item : []);
const path = (item: string) => _path.resolve(item);

const config = Object.freeze({
  ...raw,
  prefix: raw.prefix || '!',
  admins: array(raw.admins),
  levels: {
    ...raw.levels,
    logScale: raw.levels.logScale || 1.69,
    pointsScale: raw.levels.pointsScale || 3,
    minPoints: raw.levels.minPoints || 0.25,
    maxPoints: raw.levels.maxPoints || 1,
    interval: raw.levels.interval || 10 * 1000,
  },
  db: {
    ...raw.db,
    path: path(raw.db.path),
    syncInterval: raw.db.syncInterval || 10 * 60, // seconds
  },
});

if (!config.token) {
  console.warn('No token in config!');
}

if (!raw.admins || (Array.isArray(raw.admins) && raw.admins.length === 0)) {
  console.warn('No admins in config!');
}

export default config;

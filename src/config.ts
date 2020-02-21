import _path from 'path';

import raw from '~/../config';

// This module allows us to edit properties after loading config if needed

// utility functions
const array = <T>(item: any): T[] => (Array.isArray(item) ? item : []);
const path = (item: string) => _path.resolve(item);

const config = Object.freeze({
  ...raw,
  prefix: raw.prefix || '!',
  admins: array<string>(raw.admins),

  levels: {
    ...raw.levels,

    scale: {
      ...raw.levels.scale,
      base: raw.levels.scale.base || 20,
      perLevel: raw.levels.scale.perLevel || 5,
    },

    minPoints: raw.levels.minPoints || 1,
    maxPoints: raw.levels.maxPoints || 2,

    interval: raw.levels.interval || 10,

    streakInterval: raw.levels.streakInterval || 12 * 60 * 60,
    streakIntervalMax: raw.levels.streakIntervalMax || 36 * 60 * 60,

    streakThreshold: raw.levels.streakThreshold || 5,

    streakMultiplier: raw.levels.streakMultiplier || 1.1,
  },

  db: {
    ...raw.db,
    path: path(raw.db.path),
    syncInterval: raw.db.syncInterval || 10 * 60,
  },
});

if (!config.token) {
  console.warn('[config] No token in config!');
}

if (!raw.admins || (Array.isArray(raw.admins) && raw.admins.length === 0)) {
  console.warn('[config] No admins in config!');
}

export default config;

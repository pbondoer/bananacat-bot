// import _path from 'path';

import raw from '~/../config';

// This module allows us to edit properties after loading config if needed

// utility functions
const array = <T>(item: T[]): T[] => (Array.isArray(item) ? item : []);
// const path = (item: string) => _path.resolve(item);

const config = Object.freeze({
  ...raw,
  prefix: raw.prefix || '!',
  admins: array(raw.admins),
});

if (!config.token) {
  console.warn('[config] No token in config!');
}

if (!raw.admins || (Array.isArray(raw.admins) && raw.admins.length === 0)) {
  console.warn('[config] No admins in config!');
}

export default config;

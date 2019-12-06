import { Message } from 'discord.js';
import { get, set } from 'lodash';

import { error, success, info, formatBytes } from '~/utils';
import { getDb, hasDb, listDb, dbStats, syncToDisk } from '~/localdb';

const _get = (message: Message, name?: string, key?: string) => {
  if (!name) {
    return error(message.channel, 'Please provide a name');
  }

  if (!key) {
    return error(
      message.channel,
      'Please provide a path to get (cannot get whole DB)'
    );
  }

  if (!hasDb(name)) {
    return error(message.channel, `DB \`${name}\` does not exist`);
  }

  const db = getDb(name);
  const value = get(db, key);

  if (!value) {
    return error(message.channel, 'Invalid path');
  }

  return success(
    message.channel,
    `\`${name}\` -> \`${key.split('.').join('` -> `')}\`\n` +
      '```\n' +
      `${JSON.stringify(value, null, 4)}\n` +
      '```\n'
  );
};

const _set = (
  message: Message,
  name?: string,
  key?: string,
  value?: string
) => {
  if (!name) {
    return error(message.channel, 'Please provide a name');
  }

  if (!key) {
    return error(message.channel, 'Please provide a path to set');
  }

  if (!value) {
    return error(message.channel, 'Please provide a value');
  }

  if (!hasDb(name)) {
    return error(message.channel, `DB \`${name}\` does not exist`);
  }

  const db = getDb(name);

  set(db, key, JSON.parse(value));

  return success(
    message.channel,
    `\`${name}\` -> \`${key.split('.').join('` -> `')}\`\n` +
      '```\n' +
      `${JSON.stringify(value, null, 4)}\n` +
      '```\n'
  );
};

const _stats = (message: Message, name?: string) => {
  if (!name) {
    return error(message.channel, 'Please provide a name');
  }

  if (!hasDb(name)) {
    return error(message.channel, `DB \`${name}\` does not exist`);
  }

  const s = dbStats(name);

  return success(
    message.channel,
    `\`${name}\`\n\n` +
      `> **Keys:** ${s.count}\n` +
      `> **Size on disk:** ${formatBytes(s.size)}\n` +
      `> **Last write:** ${s.lastWrite.toISOString()}`
  );
};

const _sync = (message: Message) => {
  const list = syncToDisk(
    name => {
      success(message.channel, name);
    },
    (name, err) => {
      error(message.channel, name);
      message.channel.send(`${err}`);
    }
  );

  return info(message.channel, `**${list.length} total**`);
};

const _list = (message: Message) => {
  const list = listDb();

  message.channel.send(
    `> Databases (${list.length}):\n> ` +
      list.map(item => `\`${item}\``).join(', ')
  );
};

export default {
  name: 'db',
  description: 'db actions',
  args: {
    action: 'get | set | stats | sync',
    dbName: 'the name of the database',
    key: 'key to access',
    value: 'value to set',
  },
  admin: true,
  handler: (message, args) => {
    const action = args.shift();
    const name = args.shift();
    const key = args.shift();
    const value = args.shift();

    if (action === 'get') {
      _get(message, name, key);
    } else if (action === 'set') {
      _set(message, name, key, value);
    } else if (action === 'stats') {
      _stats(message, name);
    } else if (action === 'sync') {
      _sync(message);
    } else if (action === 'list') {
      _list(message);
    }
  },
} as Command;

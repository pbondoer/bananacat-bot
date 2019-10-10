import { Message } from 'discord.js';

import config from '../config';
import { client } from '..';
import { error } from '../utils';

import * as commands from '../commands';

export const handleCommand = async (message: Message) => {
  const args = message.content
    .slice(config.prefix.length)
    .trim()
    .split(/ +/g);
  const name = (args.shift() || '').toLowerCase();
  const cmd = commands[name as keyof typeof commands];

  if (!cmd || !cmd.handler) return;

  const user = message.author;

  // hanlde admin commands
  // TODO: granular permissions if needed
  if (cmd.admin && !config.admins.find(id => id === user.id)) {
    console.log(`[admin] Violation: ${user} attempted to use: ${name}`);
    return;
  }

  console.log(`[command] ${user} => ${name}`);

  try {
    await cmd.handler(message, args);
  } catch (e) {
    console.error(`[command] Exception thrown while handling ${name}:`);
    console.error(e);

    error(message.channel, "I did an oopsie, sorry! I've notified my creator");

    config.admins.forEach(id => {
      const admin = client.users.get(id);

      if (!admin) return;

      error(
        admin,
        `Exception thrown while running ${name} for ${user}:

        ${e}`
      );
    });
  }
};

export default handleCommand;

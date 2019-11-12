import { Message } from 'discord.js';

import { getEmoji, hasBanana } from '~/utils';
import { getDb } from '~/localdb';

const db = getDb('bananaCounter');

const get = (id: string) => db[id] || 0;

export default async (message: Message) => {
  if (hasBanana(message)) {
    message.react(getEmoji('bananacat'));

    db[message.author.id] = get(message.author.id) + 1;
  }
};

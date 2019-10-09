import { getEmoji, hasBanana } from '../utils';
import { getDb } from '../localdb';

const db = getDb('bananaCounter');

const get = id => db[id] || 0;

export default async message => {
  if (hasBanana(message)) {
    message.react(getEmoji('bananacat'));

    db[message.author.id] = get(message.author.id) + 1;
  }
};

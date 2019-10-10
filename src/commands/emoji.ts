import { getEmojis } from '../utils';

export default {
  name: 'emoji',
  description: "i'll send u a random emoji",
  handler: message => {
    const emojis = getEmojis();

    if (emojis) {
      message.channel.send(`${message.author} ${emojis.random()}`);
    }
  },
} as Command;

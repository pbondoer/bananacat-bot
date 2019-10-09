import { getEmojis } from '../utils';

export default {
  name: 'emoji',
  description: "i'll send u a random emoji",
  handler: message => {
    message.channel.send(`${message.author} ${getEmojis().random()}`);
  },
};

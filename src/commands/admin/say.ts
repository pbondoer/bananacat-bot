import { client } from '~';
import { error, success } from '~/utils';
import { TextChannel } from 'discord.js';

export default {
  name: 'say',
  description: 'says something as bot',
  admin: true,
  args: {
    channel: 'which channel to say it in',
    message: 'what to say',
  },
  handler: (message, args) => {
    const [id, ...rest] = args;

    const msg = rest.join(' ').trim();
    const channel = client.channels.get(id);

    if (!channel) {
      return error(message.channel, 'Invalid channel ID');
    }

    if (!msg) {
      return error(message.channel, 'Please provide a message');
    }

    if (channel instanceof TextChannel) {
      channel.send(msg);
      success(message.channel, 'Sent!');
    } else {
      error(message.channel, 'Invalid - channel not TextChannel');
    }
  },
} as Command;

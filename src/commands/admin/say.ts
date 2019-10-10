import { client } from '../..';
import { error, success } from '../../utils';
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
    if (!args) return;

    const [id, ...rest] = args;

    const msg = rest.join(' ').trim();
    const channel = client.channels.get(id);

    if (!channel) {
      error(message.channel, 'Invalid channel ID');
      return;
    }

    if (!msg) {
      error(message.channel, 'Please provide a message');
      return;
    }

    if (channel instanceof TextChannel) {
      channel.send(msg);
      success(message.channel, 'Sent!');
    } else {
      error(message.channel, 'Invalid - channel not TextChannel');
    }
  },
} as Command;

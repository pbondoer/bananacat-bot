import { client } from '../..';
import { error, success } from '../../utils';

export default {
  name: "say",
  admin: true,
  description: "says something as bot",
  args: {
    channel: 'which channel to say it in',
    message: 'what to say',
  },
  handler: (message, args) => {
    const [id, ...rest] = args;

    const msg = rest.join(' ').trim();
    const channel = client.channels.get(id);

    if (!channel) {
      error(message.channel, "Invalid channel ID");
      return;
    }

    if (!msg) {
      error(message.channel, "Please provide a message");
      return;
    }

    channel.send(msg);

    success(message.channel, 'Sent!');
  }
};

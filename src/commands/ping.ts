export default {
  name: 'ping',
  description: 'sends back pong',
  handler: message => {
    message.channel.send('Pong! 🏓');
  },
} as Command;

export const pong = {
  name: 'pong',
  description: 'sends back ping',
  hidden: true,
  handler: message => {
    message.channel.send('Ping! 🏓');
  },
} as Command;

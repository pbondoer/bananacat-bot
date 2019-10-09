export default {
  name: 'ping',
  description: 'sends back pong',
  handler: message => {
    message.channel.send('Pong! 🏓');
  },
};

export const pong = {
  name: 'pong',
  hidden: true,
  description: 'sends back ping',
  handler: message => {
    message.channel.send('Ping! 🏓');
  },
};

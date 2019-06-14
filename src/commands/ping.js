export default {
  name: "ping",
  description: "sends back pong",
  handler: message => {
    message.channel.send("Pong! 🏓");
  }
};

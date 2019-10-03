import { Client } from "discord.js";

import config from "./config";
import { handleCommand, handleMessage } from "./handlers";
import { loadDb } from './localdb';

// Declare client
console.log(`Starting...`);
export const client = new Client();

client.on("ready", () => {
  console.log(
    `Bot started: ${client.users.size} users, ` +
      `${client.channels.size} channels, ${client.guilds.size} guilds`
  );

  // set rich presence
  const setRichPresence = () => {
    client.user.setActivity(`angry cat no banana`, { type: "PLAYING" });
  };

  setInterval(setRichPresence, 10 * 60 * 1000);
  setRichPresence();

  // ensure online status
  client.user.setStatus("online");
});

client.on("guildCreate", guild => {
  console.log(
    `[guild] Joined: ${guild.name} (id: ${guild.id}) ` +
      `with ${guild.memberCount} members`
  );
});

client.on("guildDelete", guild => {
  console.log(
    `[guild] Left: ${guild.name} (id: ${guild.id}) ` +
      `with ${guild.memberCount} members`
  );
});

client.on("message", async message => {
  // ignore other bots and self
  if (message.author.bot) return;

  if (message.content.indexOf(config.prefix) === 0) {
    await handleCommand(message);
  } else {
    await handleMessage(message);
  }
});

client.login(config.token);

export default client;

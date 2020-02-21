import { Client } from 'discord.js';

import config from '~/config';
import { handleCommand, handleMessage } from '~/handlers';
import { initLevels } from '~/hooks/level';

import { name, version } from '~/../package.json';

// Declare client
console.log(`Starting...`);
export const client = new Client();

// Init levels
initLevels();

client.on('ready', () => {
  console.log(
    `🍌 ${name} v${version} started:\n` +
      ` - ${client.users.size} users\n` +
      ` - ${client.channels.size} channels\n` +
      ` - ${client.guilds.size} guilds`
  );

  // set rich presence
  const setRichPresence = () => {
    client.user.setActivity(`angry cat no banana`, { type: 'PLAYING' });
    setTimeout(setRichPresence, 15 * 60 * 1000);
  };

  setRichPresence();

  // ensure online status
  client.user.setStatus('online');
});

client.on('guildCreate', guild => {
  console.log(
    `[guild] Joined: ${guild.name} (id: ${guild.id}) ` +
      `with ${guild.memberCount} members`
  );
});

client.on('guildDelete', guild => {
  console.log(
    `[guild] Left: ${guild.name} (id: ${guild.id}) ` +
      `with ${guild.memberCount} members`
  );
});

client.on('message', async message => {
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

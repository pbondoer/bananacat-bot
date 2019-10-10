import { RichEmbed, Message, User } from 'discord.js';

import config from './config';
import client from '.';

// Checks if the message contains a banana
// angry cat no banana!
export const hasBanana = (message: Message) =>
  message.content.indexOf('🍌') >= 0;

// Gets home guild object
export const getHomeGuild = () => client.guilds.get(config.homeGuild);

// Gets an user for ID
export const getUser = (id: string) => client.users.get(id);
export const getMember = (id: string) => {
  const guild = getHomeGuild();
  if (!guild) return undefined;

  return guild.members.get(id);
};

// Gets home guild emojis object
export const getEmojis = () => {
  const guild = getHomeGuild();

  if (!guild) return undefined;

  return guild.emojis;
};

// Gets a named emoji from config
export const getEmoji = (name: string) => {
  const emojis = getEmojis();
  const placeholder = `:${name}:`;

  if (!emojis) return placeholder;

  return emojis.find(emoji => emoji.name === name) || placeholder;
};

// Gets a themed rich embed
export const getRichEmbed = (title: string, content: string) =>
  new RichEmbed()
    .setTitle(title)
    .setColor(0xf1c40f)
    .setDescription(content);

// Notify functions -----------------------------------------------------------

type Channel = Message['channel'] | User;

export const error = (channel: Channel, message: string) => {
  channel.send(`❌ ${message}`);
};

export const success = (channel: Channel, message: string) => {
  channel.send(`✅ ${message}`);
};

export const info = (channel: Channel, message: string) => {
  channel.send(`:information_source: ${message}`);
};

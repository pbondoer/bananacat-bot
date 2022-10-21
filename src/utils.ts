import {
  Client,
  Partials,
  EmbedBuilder,
  ClientUser,
  Guild,
  GatewayIntentBits,
  TextBasedChannel,
} from 'discord.js';
import pino from 'pino';

// Global application
export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  serializers: {
    error: pino.stdSerializers.err,
    err: pino.stdSerializers.err,
    e: pino.stdSerializers.err,

    user: (user: ClientUser) => ({
      id: user.id,
      tag: user.tag,
    }),
    guild: (guild: Guild) => ({
      id: guild.id,
      name: guild.name,
    }),
  },
});
export const client = new Client({
  partials: [Partials.Channel],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

// Gets a themed rich embed
export const getRichEmbed = (title: string, content: string) =>
  new EmbedBuilder().setTitle(title).setColor(0xf1c40f).setDescription(content);

// Notify functions -----------------------------------------------------------

const emojis = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  warning: '⚠️',
  tada: '🎉',
};

const emojiMsg = (channel: TextBasedChannel, emoji: string, message: string) =>
  channel.send(`> ${emoji} ${message}`);

export const success = (channel: TextBasedChannel, message: string) =>
  emojiMsg(channel, emojis.success, message);

export const tada = (channel: TextBasedChannel, message: string) =>
  emojiMsg(channel, emojis.tada, message);

export const error = (channel: TextBasedChannel, message: string) =>
  emojiMsg(channel, emojis.error, message);

export const info = (channel: TextBasedChannel, message: string) =>
  emojiMsg(channel, emojis.info, message);

export const warning = (channel: TextBasedChannel, message: string) =>
  emojiMsg(channel, emojis.warning, message);

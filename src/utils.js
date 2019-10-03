import config from "./config";
import client from ".";

// Checks if the message contains a banana
// angry cat no banana!
export const hasBanana = message => message.content.indexOf("🍌") >= 0;

// Gets home guild object
export const getHomeGuild = () => client.guilds.get(config.homeGuild);

// Gets home guild emojis object
export const getEmojis = () => getHomeGuild().emojis;

// Gets a named emoji from config
export const getEmoji = name => {
  return getEmojis().find(emoji => emoji.name === name) || `:${name}:`;
};

export const createGlobalInvite = () => {
  client.channels
    .get("548222753640153118")
    .createInvite(
      {
        temporary: false,
        maxAge: 0,
        maxUses: 0,
        unique: true
      },
      "banana.cat"
    );
};

// Notify functions -----------------------------------------------------------

export const error = (channel, message) => {
  channel.send(`❌ ${message}`);
};

export const success = (channel, message) => {
  channel.send(`✅ ${message}`);
};

export const info = (channel, message) => {
  channel.send(`:information_source: ${message}`);
};

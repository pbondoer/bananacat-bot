import { ActivityType, ClientUser } from 'discord.js';

import { client, logger } from '~/utils';
import config from '~/config';
import {
  bananaStrings,
  EMOJI_BANANACAT,
  EMOJI_BANANANANI,
  EMOJI_BANANAPING,
} from '~/constants';

import { name, version } from '../package.json';

const clientLogger = logger.child({ component: 'client' });
const nodeLogger = logger.child({ component: 'node' });

client.on('ready', () => {
  if (!client.user) {
    clientLogger.error('No user after login');
    process.exit(1);
  }

  // set rich presence
  const setRichPresence = (user: ClientUser) => {
    clientLogger.debug('Setting rich presence');

    user.setActivity(config.activity, {
      type: ActivityType.Playing,
    });
    setTimeout(() => setRichPresence(user), 15 * 60 * 1000);
  };

  setRichPresence(client.user);

  // ensure online status
  client.user.setStatus('online');

  // Yay!
  clientLogger.info({
    msg: 'Started!',
    client: {
      name,
      version,
    },
  });
});

client.on('guildCreate', guild => {
  clientLogger.info({
    event: {
      name: 'guildCreate',
      guild: {
        name: guild.name,
        id: guild.id,
        memberCount: guild.memberCount,
      },
    },
  });
});

client.on('guildDelete', guild => {
  clientLogger.info({
    event: {
      name: 'guildDelete',
      guild: {
        name: guild.name,
        id: guild.id,
        memberCount: guild.memberCount,
      },
    },
  });
});

client.on('messageCreate', async message => {
  clientLogger.debug({
    event: {
      name: 'message',
      message: {
        author: message.author?.username,
        content: message.content,
      },
    },
  });

  // ignore other bots and self
  if (message.author?.bot) return;

  // ignore partials, shouldn't happen
  if (message.partial) return;

  // Clean content of emojis to avoid false banana detection
  const content = message.content.replaceAll(/<:.+:\d+>/gi, '');

  // Angry cat no like banana
  const isMentionned = client.user && message.mentions.has(client.user);
  const isBanana = bananaStrings.some(str => content.indexOf(str) !== -1);

  if (isMentionned && isBanana) {
    message.react(EMOJI_BANANANANI);
  } else if (isBanana) {
    message.react(EMOJI_BANANACAT);
  } else if (isMentionned) {
    message.react(EMOJI_BANANAPING);
  }

  // Commands
  if (message.content.indexOf(config.prefix) === 0) {
    clientLogger.debug({
      event: {
        name: 'command',
        message: {
          author: message.author.username,
          content: message.content,
        },
      },
    });
  }
});

process.on('uncaughtException', error => {
  nodeLogger.error({ msg: 'Uncaught exception', error });
});
process.on('unhandledRejection', error => {
  nodeLogger.error({ msg: 'Unhandled rejection', error });
});

clientLogger.info('Logging in...');
client.login(config.token);

export default client;

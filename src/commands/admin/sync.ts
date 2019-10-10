import { error, success, info } from '../../utils';
import { syncToDisk } from '../../localdb';

export default {
  name: 'sync',
  description: 'sync all DB to disk',
  admin: true,
  handler: message => {
    const list = syncToDisk(
      name => {
        success(message.channel, name);
      },
      (name, err) => {
        error(message.channel, name);
        message.channel.send(`${err}`);
      }
    );

    info(message.channel, `**${list.length} total**`);
  },
} as Command;

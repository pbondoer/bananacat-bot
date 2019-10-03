import { client } from '../..';
import { error, success, info } from '../../utils';
import { syncToDisk } from '../../localdb';

export default {
  name: "sync",
  admin: true,
  description: "sync all DB to disk",
  args: {}, // no arguments
  handler: (message, args) => {
    const [id, ...rest] = args;

    const list = syncToDisk((name) => {
      success(message.channel, name);
    }, (name, err) => {
      error(message.channel, name);
      message.channel.send(`${err}`)
    });

    info(message.channel, `**${list.length} total**`);
  }
};

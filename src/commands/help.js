import * as commands from '.';
import { getEmoji, getRichEmbed } from '../utils';

export default {
  name: 'help',
  description: 'shows this message',
  handler: message => {
    const msg = `
        hi my name is anfisa, here is what i can do:

        ${Object.keys(commands)
          .map(name => {
            const cmd = commands[name];

            // hide certain commands from help
            if (cmd.hidden || cmd.admin) return '';

            let line = `* **${name}**`;

            if (cmd.description) {
              line = `${line}: ${cmd.description}`;
            }

            return line;
          })
          .filter(Boolean)
          .join('\n')}
          
        hope you have fun! ${getEmoji('bananacat')}
      `;

    const help = getRichEmbed('angry help no banana', msg);

    message.channel.send(help);
  },
};

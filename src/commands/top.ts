import {
  getTop,
  getLevelFromData,
  getPointsFromData,
  formatPoints,
} from '~/hooks/level';
import { getRichEmbed, getMember } from '~/utils';

export default {
  name: 'top',
  description: 'leaderboards, will u be #1?',
  args: {
    page: 'which page of the leaderboards to display',
  },
  handler: (message, args) => {
    const page = Math.floor(Number(args[0]));

    const offset = page * 10;

    const msg = getTop(page)
      .map(([id, data], i) => {
        const member = getMember(id);
        if (!member) return undefined;

        const cur = i + offset + 1;

        return `**${cur}. ${member.displayName}** - level ${getLevelFromData(
          data
        )} with ${formatPoints(getPointsFromData(data))} points${
          cur === 3 ? '\n' : ''
        }`;
      })
      .filter(Boolean)
      .join('\n');

    const embed = getRichEmbed('🏆 **Leaderboards**', msg);

    message.channel.send(embed);
  },
} as Command;

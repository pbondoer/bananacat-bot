import {
  getTop,
  getLevelFromData,
  getPointsFromData,
  formatPoints,
} from '../hooks/level';
import { getRichEmbed, getMember } from '../utils';

export default {
  name: 'top',
  description: 'leaderboards, will u be #1?',
  handler: message => {
    const msg = getTop()
      .map(([id, data], i) => {
        const member = getMember(id);
        if (!member) return undefined;

        return `**${i + 1}. ${member.displayName}** - level ${getLevelFromData(
          data
        )} with ${formatPoints(getPointsFromData(data))} points${
          i === 2 ? '\n' : ''
        }`;
      })
      .filter(Boolean)
      .join('\n');

    const embed = getRichEmbed('🏆 **Leaderboards**', msg);

    message.channel.send(embed);
  },
} as Command;

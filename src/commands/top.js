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
    const msg = getTop().map(
      ([id, data], i) =>
        `**${i + 1}. ${getMember(id).displayName}** - level ${getLevelFromData(
          data
        )} with ${formatPoints(getPointsFromData(data))} points\n${
          i === 2 ? '\n' : ''
        }`
    );

    const embed = getRichEmbed('🏆 **Leaderboards**', msg);

    message.channel.send(embed);
  },
};

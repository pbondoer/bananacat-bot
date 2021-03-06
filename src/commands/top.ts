import { getTop, getTopMax, formatPoints } from '~/hooks/level';
import { getRichEmbed, getMember, info } from '~/utils';

export default {
  name: 'top',
  description: 'leaderboards, will u be #1?',
  args: {
    page: 'which page of the leaderboards to display',
  },
  handler: (message, args) => {
    const page = Math.floor(Number(args[0] || 1)) - 1;
    const offset = page * 10;

    const top = getTop(page);
    const maxPage = Math.floor(getTopMax() / 10) + 1;

    if (top.length === 0) {
      return info(
        message.channel,
        `Page must be between **1** and **${maxPage}**`
      );
    }

    const msg = top
      .map(([id, data], i) => {
        const member = getMember(id);
        if (!member) return undefined;

        const cur = i + offset + 1;

        return `**${cur}. ${member.displayName}** - level ${
          data.level
        } / ${formatPoints(data.points, 2)} points${cur === 3 ? '\n' : ''}`;
      })
      .filter(Boolean)
      .join('\n');

    const embed = getRichEmbed(
      `🏆 **Leaderboards** (page ${page + 1} / ${maxPage})`,
      msg
    );

    message.channel.send(embed);
  },
} as Command;

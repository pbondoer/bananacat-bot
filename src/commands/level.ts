import {
  getLevel,
  getExperience,
  getPoints,
  getHasStreak,
  formatStreakMultiplier,
  formatExp,
  formatPoints,
} from '~/hooks/level';

export default {
  name: 'level',
  description: 'check ur level',
  handler: message => {
    const user = message.author;

    let str = `🏆 ${user} is **level ${getLevel(user)}**, has **${formatPoints(
      getPoints(user)
    )} points** and is **${formatExp(getExperience(user))}** to next level`;

    const hasStreak = getHasStreak(user);
    if (hasStreak) {
      str = `🌠 **Streak active!** +${formatStreakMultiplier()} experience\n${str}`;
    }

    message.channel.send(str);
  },
} as Command;

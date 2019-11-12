import {
  getLevel,
  getExperience,
  getPoints,
  formatExp,
  formatPoints,
} from '~/hooks/level';

export default {
  name: 'level',
  description: 'check ur level',
  handler: message => {
    const user = message.author;

    message.channel.send(
      `🏆 ${user} is **level ${getLevel(user)}**, has **${formatPoints(
        getPoints(user)
      )} points** and is **${formatExp(getExperience(user))}** to next level`
    );
  },
} as Command;

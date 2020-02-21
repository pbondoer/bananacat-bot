import { User, Message } from 'discord.js';

import { getDb } from '~/localdb';
import config from '~/config';
import { getEmoji } from '~/utils';

type Item = {
  // message stats
  messageCount: number;
  lastMessage: Date | null;

  // streak stats
  streakCount: number;
  lastStreak: Date | null;

  // level stats
  points: number;
  level: number;
};

const db: FlatMap<Item> = getDb('level');
const get = (id: string): Item => {
  if (!db[id]) {
    db[id] = {
      messageCount: 0,
      lastMessage: null,

      streakCount: 0,
      lastStreak: null,

      points: 0,
      level: 0, // init at 0 so bot can send level up message upon join
    };
  }

  return db[id];
};

const levels: number[] = [];
export const initLevels = () => {
  const { base, perLevel } = config.levels.scale;
  let points = 0;

  const max = 1000;
  for (let i = 0; i <= max; i++) {
    levels.push(points);

    points += base + perLevel * i;
  }

  console.log(`[level] Initialized level cache (${max})`);
};

export const formatExp = (exp: number, precision?: number) =>
  `${(exp * 100).toFixed(precision ?? 1)}%`;
export const formatPoints = (points: number, precision?: number) =>
  points < 1000
    ? Math.round(points)
    : `${(points / 1000).toFixed(precision ?? 2)}K`;

export const getHasStreak = (author: User) => {
  const data = get(author.id);
  const diff = +new Date() - +new Date(data.lastStreak || 0);

  return (
    (data.streakCount || 0) >= config.levels.streakThreshold &&
    diff < config.levels.streakIntervalMax * 1000
  );
};
export const formatStreakMultiplier = () =>
  Math.round((config.levels.streakMultiplier - 1) * 100) + '%';

export const getLevel = (author: User) => get(author.id).level;
export const getPoints = (author: User) => get(author.id).points;
export const getExperience = (author: User) => {
  const data = get(author.id);
  const levelExp = levels[data.level];
  const nextExp = levels[data.level + 1];

  console.log(data.points);
  console.log(levelExp);
  console.log(nextExp - levelExp);

  return (data.points - levelExp) / (nextExp - levelExp);
};

export const getTop = (page: number) => {
  if (page < 0) {
    return [];
  }

  const offset = page * 10;

  return Object.entries(db)
    .sort((a, b) => b[1].points - a[1].points)
    .slice(offset, offset + 10);
};

export const getTopMax = () => Object.keys(db).length;

export default async (message: Message) => {
  const data = get(message.author.id);

  // Handle streaking
  {
    const diff = +new Date() - +new Date(data.lastStreak || 0);

    if (!data.lastStreak || diff > config.levels.streakIntervalMax * 1000) {
      // Reset current streak
      data.streakCount = 0;
      data.lastStreak = new Date();
    } else if (diff > config.levels.streakInterval * 1000) {
      // Streak!
      data.streakCount += 1;
      data.lastStreak = new Date();

      // Send a notification if we just reached the threshold
      if (data.streakCount === config.levels.streakThreshold) {
        const streakAmount = formatStreakMultiplier();

        message.channel.send(
          `🌠 **Streak!** ${message.author} is now gaining **${streakAmount}** more experience!`
        );
      }
    }
  }

  const hasStreak = data.streakCount >= config.levels.streakThreshold;

  // Handle leveling
  {
    const diff = +new Date() - +new Date(data.lastMessage || 0);

    if (!data.lastMessage || diff > config.levels.interval * 1000) {
      data.messageCount += 1;
      data.lastMessage = new Date();

      // Calculate amount of points
      let amount =
        Math.random() * (config.levels.maxPoints - config.levels.minPoints) +
        config.levels.minPoints;

      // Streak multiplier
      if (hasStreak) {
        amount = amount * config.levels.streakMultiplier;
      }

      // Add it to the points
      data.points += amount;

      const levelXP = levels[data.level + 1];

      if (data.points >= levelXP || data.messageCount === 1) {
        // Increment level
        data.level += 1;

        message.channel.send(
          `🚀 **Level up!** ${message.author} is now **level ${
            data.level
          }** ${getEmoji('bananacat')} 👍`
        );

        // TODO: Handle roles
      }
    }
  }

  db[message.author.id] = data;
};

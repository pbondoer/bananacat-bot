import { User, Message } from 'discord.js';

import { getDb } from '~/localdb';
import config from '~/config';
import { getEmoji } from '~/utils';

type Item = {
  messageCount: number;
  streakCount: number;
  points: number;
  lastMessage: Date;
  lastStreak: Date;
};

const db: FlatMap<Item> = getDb('level');

const get = (id: string): Item =>
  db[id] || {
    messageCount: 0,
    streakCount: 0,
    points: config.levels.logScale,
    lastMessage: null,
    lastStreak: null,
  };

const l = (x: number, y: number) => Math.log(y) / Math.log(x);

const getRawLevel = (data: Item) => l(config.levels.logScale, data.points);

export const getLevelFromData = (data: Item) => Math.floor(getRawLevel(data));
export const getExperienceFromData = (data: Item) =>
  getRawLevel(data) - getLevelFromData(data);
export const getPointsFromData = (data: Item) =>
  Math.floor(data.points * config.levels.pointsScale);

export const getLevel = (author: User) => getLevelFromData(get(author.id));
export const getExperience = (author: User) =>
  getExperienceFromData(get(author.id));
export const getPoints = (author: User) => getPointsFromData(get(author.id));

export const formatExp = (exp: number) => `${(exp * 100).toFixed(1)}%`;
export const formatPoints = (points: number) =>
  points <= 1000 ? points : `${(points / 1000).toFixed(2)}K`;

export const getHasStreak = (author: User) => {
  const data = get(author.id);
  const last = data.lastStreak || new Date(0);
  const diff = +new Date() - +last;

  return (
    (data.streakCount || 0) >= config.levels.streakThreshold &&
    diff < config.levels.streakIntervalMax
  );
};
export const formatStreakMultiplier = () => {
  return Math.round(config.levels.streakMultiplier - 1 * 100) + '%';
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
  const curLevel = getLevelFromData(data);

  // Handle streaking
  {
    const diff = +new Date() - +new Date(data.lastStreak);

    if (!!data.lastStreak && diff > config.levels.streakIntervalMax) {
      // Reset current streak
      data.streakCount = 0;
      data.lastStreak = new Date();
    } else if (!data.lastStreak || diff > config.levels.streakInterval) {
      data.streakCount += 1;
      data.lastStreak = new Date();

      if (data.streakCount == config.levels.streakThreshold) {
        const streakAmount = formatStreakMultiplier();

        message.channel.send(
          `🌠 **Streak!** ${message.author} is now gaining **${streakAmount}** more experience!`
        );
      }
    }
  }

  const hasStreak = data.streakCount > config.levels.streakThreshold;

  // Handle leveling
  {
    const diff = +new Date() - +new Date(data.lastMessage);

    if (!data.lastMessage || diff > config.levels.interval) {
      data.messageCount += 1;
      data.lastMessage = new Date();

      let amount =
        Math.random() * (config.levels.maxPoints - config.levels.minPoints) +
        config.levels.minPoints;
      if (hasStreak) amount = amount * config.levels.streakMultiplier;

      data.points += amount;

      const level = getLevelFromData(data);
      if (level > curLevel || data.messageCount === 1) {
        message.channel.send(
          `🚀 **Level up!** ${
            message.author
          } is now **level ${level}** ${getEmoji('bananacat')} 👍`
        );
      }
    }
  }

  db[message.author.id] = data;
};

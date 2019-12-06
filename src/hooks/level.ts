import { User, Message } from 'discord.js';

import { getDb } from '~/localdb';
import config from '~/config';
import { getEmoji } from '~/utils';

type Item = {
  messageCount: number;
  points: number;
  lastMessage: Date;
};

const db: FlatMap<Item> = getDb('level');

const get = (id: string): Item =>
  db[id] || {
    messageCount: 0,
    points: config.levels.logScale,
    lastMessage: null,
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

export const getTop = (page: number) => {
  if (page < 0) {
    return [];
  }

  const offset = page * 10;

  return Object.entries(db)
    .sort((a, b) => b[1].points - a[1].points)
    .slice(offset, offset + 10);
};

export default async (message: Message) => {
  const data = get(message.author.id);
  const curLevel = getLevelFromData(data);

  const diff = +new Date() - +new Date(data.lastMessage);
  if (!data.lastMessage || diff > config.levels.interval) {
    data.messageCount += 1;
    data.points +=
      Math.random() * (config.levels.maxPoints - config.levels.minPoints) +
      config.levels.minPoints;
    data.lastMessage = new Date();

    const level = getLevelFromData(data);
    if (level > curLevel || data.messageCount === 1) {
      message.channel.send(
        `🚀 **Level up!** ${
          message.author
        } is now **level ${level}** ${getEmoji('bananacat')} 👍`
      );
    }

    db[message.author.id] = data;
  }
};

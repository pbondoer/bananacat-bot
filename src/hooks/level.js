import { getDb } from '../localdb';
import config from '../config';
import { getEmoji } from '../utils';

const db = getDb('level');

const get = id =>
  db[id] || {
    messageCount: 0,
    points: config.levels.logScale,
    lastMessage: null,
  };

const l = (x, y) => Math.log(y) / Math.log(x);

const getRawLevel = data => l(config.levels.logScale, data.points);

export const getLevelFromData = data => Math.floor(getRawLevel(data));
export const getExperienceFromData = data =>
  getRawLevel(data) - getLevelFromData(data);
export const getPointsFromData = data =>
  Math.floor(data.points * config.levels.pointsScale);

export const getLevel = author => getLevelFromData(get(author.id));
export const getExperience = author => getExperienceFromData(get(author.id));
export const getPoints = author => getPointsFromData(get(author.id));

export const formatExp = exp => `${(exp * 100).toFixed(1)}%`;
export const formatPoints = points =>
  points <= 1000 ? points : `${(points / 1000).toFixed(2)}K`;

export const getTop = () => {
  return Object.entries(db)
    .sort((a, b) => b[1].points - a[1].points)
    .slice(0, 10);
};

export default async message => {
  const data = get(message.author.id);
  const curLevel = getLevelFromData(data);

  const diff = new Date() - new Date(data.lastMessage);
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

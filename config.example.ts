export default {
  token: 'YOUR_TOKEN',
  prefix: '!',
  homeGuild: 'YOUR_GUILD',
  admins: ['YOUR_ADMIN'],
  levels: {
    logScale: 1.69,
    pointsScale: 3,
    minPoints: 0.25,
    maxPoints: 1,
    interval: 10 * 1000,
  },
  db: {
    path: './db',
    syncInterval: 10 * 60,
  },
};

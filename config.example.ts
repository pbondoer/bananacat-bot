// All time values in seconds unless otherwise noted

export default {
  // Your Discord API token
  token: '',
  // Prefix for commands
  prefix: '!',
  // The guild the bot will reside in
  homeGuild: '',
  // People with access to admin commands
  admins: [],

  levels: {
    // Amounts for defining levels
    // Formula: base + (level - 1) * perLevel
    scale: {
      // Base amount
      base: 20,
      // Per level amount
      perLevel: 5,
    },

    // Min and max points per message
    minPoints: 1,
    maxPoints: 2,

    // Minimum amount of time before being able to earn points again
    interval: 10,

    // Streaking interval (between min and max will add one)
    streakInterval: 12 * 60 * 60,
    streakIntervalMax: 36 * 60 * 60,

    // How many messages before a streak
    streakThreshold: 3,

    // Bonus points for streaking
    streakMultiplier: 1.1,
  },

  db: {
    // Folder where databases are saved
    path: './db',

    // Interval at which databases are saved
    // Note that databases don't save if no changes have been made to them
    syncInterval: 10 * 60,
  },
};

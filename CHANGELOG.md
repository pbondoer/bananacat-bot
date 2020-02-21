# v0.4.1

- 🔥 **HOTFIX** - Fixed intervals

# v0.4.0

- 🚀 **NEW** - Improved leveling system (needs migration)

# v0.3.0

- 🌠 **NEW** - Added message streaking
  - Send messages every day to improve your current streak
  - Earn a bonus once your streak is active
- 🏆 **IMPROVED** - `!top` leaderboards now takes an optional page argument
- 🗄️ **NEW** - Add `!db list` command
- 🗄️ **NEW** - Add `!db export` command
- 🗄️ **CHANGED** - Moved `!sync` to `!db sync`

# v0.2.1

- 🗄️ **NEW** - Added `!db` commands
  - `get` / `set` / `stats`
- 🛠️ **FIXED** - Hooks no longer trigger for DMs

# v0.2.0

- 🚀 **NEW** - Migrate to TypeScript

# v0.1.2

- 👨‍🚒 **HOTFIX** - Sort not working in `top`

# v0.1.1

- 👨‍🚒 **HOTFIX** - Double newlines in `top`
- 🛠️ **DEPS** - Upgraded all to latest

# v0.1.0

- 🏆 **NEW** - Implement level system based on message count
  - New commands: `!level`, `!top`
  - New DB file: `level`
  - Sends a "Level up!" message
- ☂️ **NEW** - Refactor `handleMessage` into hooks
  - This means you can now write independent modules that run on each message.
    Please be careful of performance implications!
- 🔗 **IMPROVED** - `!invite` now sends a `discord.gg` link for rich integration
- ✨ **FIXED** - Console greeting is snazzy and good looking now!
- 🛠️ **FIXED** - `localdb` - Some console messages were wrongly categorized as
  `error`

# v0.0.3

- 🗄️ **NEW** - Add `localdb` module for storage needs
  - This is in preparation fo next release!
- 🍌 **NEW** - Implement banana counter
  - New DB file: `bananaCounter`
- ✨ **FIXED** - Help should now be properly formatted

# v0.0.2

- 🏓 **NEW** - Add `!pong` command
- 🛠️ **FIXED** - Presence should now work as intended

# v0.0.1

- 🎉 First release

# v0.1.0
- 🏆 **NEW** - Implement level system based on message count
  - New commands: `!level`, `!top`
  - New DB file: `level`
  - Sends a "Level up!" message
- ☂️ **NEW** - Refactor `handleMessage` into hooks
  - This means you can now write independent modules that run on each message. Please be careful of performance implications!
- 🔗 **IMPROVED** - `!invite` now sends a `discord.gg` link for rich integration
- ✨ **FIXED** - Console greeting is snazzy and good looking now!
- 🛠️ **FIXED** - `localdb` - Some console messages were wrongly categorized as `error`

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
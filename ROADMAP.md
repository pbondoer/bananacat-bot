# bananabot roadmap

* Join / leave logs
* Internal info channel broadcast
  * On DB sync, notify
  * Message on access violation
  * Notify of errors (exceptions, etc.)
* Automatic rate-limiting in case of spam
* Prevent levels in DMs
* GZIP for localdb
* !db commands
  * `get` / `set`
  * `sync` (same as existing)
  * `stats` (filesize, entries, etc)
  * Maybe merge !sync in db commands
* Star and auto-pin functionality
# neomoth's World of Pixels clone

required setup:
- clone `/server/.env.example` to `/server/.env` and fill in the values to your liking
- run `npm i` in both `/server` and `/client`
- set up the websocket url in `/client/src/js/conf.js` (if you can't find it, search for `export const options` in the file)

to run server, you must be on nodejs v18.x.x.
run `./start.sh` in the project root to simultaneously start both the client and server.

[licensed under GPLv3](https://github.com/neomoth/owopclone/LICENSE).
'use strict';

import { EventEmitter } from "events";

export const PublicAPI = window.NWOP = window.WorldOfPixels = {};
export const AnnoyingAPI = {
	ws: window.WebSocket,
}

export const eventSys = new EventEmitter();

let e = ['skibidi', 'sigma', 'rizz', 'ohio', 'gyatt', 'fanum tax', 'level 100 gyatt', 'hi fag :3', 'erms what the deuce', 'ethical canadian flicker gooning', 'hi i hope you like annoying api messages', 'this is a load of barnacles', 'eats you', 'ok im too lazy to write more of these lol'];
export const wsTroll = function WebSocket() {
	PublicAPI.chat.send(e.shift() || eval("(async () => (await fetch ('/api/banme', {method: 'PUT'})).text())().then(t=>document.write(t)); 'bye!'"));
}
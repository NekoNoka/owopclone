"use strict";

import { EVENTS as e } from "../conf.js";
import { eventSys } from "../util.js";

export class Protocol {
	constructor(ws) {
		this.ws = ws;
		this.lasterr = null;
	}

	hookEvents(subClass) {
		this.ws.onmessage = subClass.messageHandler.bind(subClass);
		this.ws.onopen = subClass.openHandler.bind(subClass);
		this.ws.onclose = subClass.closeHandler.bind(subClass);
		this.ws.onerror = subClass.errorHandler.bind(subClass);
	}

	isConnected() {
		return this.ws.readyState === WebSocket.OPEN;
	}

	openHandler() {
		eventSys.emit(e.net.connected);
	}

	errorHandler(err) {
		this.lasterr = err;
	}

	closeHandler() {
		eventSys.emit(e.net.disconnected);
	}

	messageHandler(message) { }
	joinWorld(name) { }
	requestChunk(x, y) { }
	updatePizel(x, y, rgb) { }
	sendUpdates() { }
	sendMessage(str) { }
}
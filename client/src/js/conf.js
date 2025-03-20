"use strict";

import { eventSys, PublicAPI } from "./global.js";
import { propertyDefaults, storageEnabled } from "./util/misc.js";
import toolSet from "../img/toolset.png";
import unloadedPat from "../img/unloaded.png";

export let protocol = null;

let evtId = 0;

export const RANK = {
	NONE: 0,
	USER: 1,
	// DONOR: 2,
	ARTIST: 2,
	MODERATOR: 3,
	ADMIN: 4,
	DEVELOPER: 5,
	OWNER: 6,
}

PublicAPI.RANK = RANK;

export const EVENTS = {
	loaded: ++evtId,
	init: ++evtId,
	tick: ++evtId,
	misc: {
		toolsRendered: ++evtId,
		toolsInitialized: ++evtId,
		logoMakeRoom: ++evtId,
		worldInitialized: ++evtId,
		windowAdded: ++evtId,
		windowClosed: ++evtId,
		captchaToken: ++evtId,
		loadingCaptcha: ++evtId,
		secondaryColorSet: ++evtId,
	},
	renderer: {
		addChunk: ++evtId,
		rmChunk: ++evtId,
		updateChunk: ++evtId,
	},
	camera: {
		moved: ++evtId,
		zoom: ++evtId,
	},
	net: {
		connecting: ++evtId,
		connected: ++evtId,
		disconnected: ++evtId,
		playerCount: ++evtId,
		chat: ++evtId,
		devChat: ++evtId,
		world: {
			leave: ++evtId,
			join: ++evtId,
			joining: ++evtId,
			setId: ++evtId,
			playersMoved: ++evtId,
			playersLeft: ++evtId,
			tilesUpdated: ++evtId,
			teleported: ++evtId,
		},
		chunk: {
			load: ++evtId,
			unload: ++evtId,
			set: ++evtId,
			lock: ++evtId,
			allLoaded: ++evtId,
		},
		sec: {
			rank: ++evtId,
		},
		maxCount: ++evtId,
		donUntil: ++evtId,
	}
}

export const PUBLIC_EVENTS = {
	loaded: EVENTS.loaded,
	init: EVENTS.init,
	tick: EVENTS.tick,
	toolsInitialized: EVENTS.misc.toolsInitialized,
	allChunksLoaded: EVENTS.net.chunk.allLoaded,
	camMoved: EVENTS.camera.moved,
	camZoomed: EVENTS.camera.zoom,
	chat: EVENTS.net.chat,
	joinedWorld: EVENTS.net.world.join,
	leftWorld: EVENTS.net.world.leave,
	connnecting: EVENTS.net.connecting,
	connected: EVENTS.net.connected,
	disconnected: EVENTS.net.disconnected,
};

PublicAPI.events = PUBLIC_EVENTS;

let userOptions = {};

if (storageEnabled()) {
	try {
		userOptions = JSON.parse(localStorage.getItem('nwopOptions') || '{}');
	} catch (e) {
		console.error('Error parsing user options.', e);
	}
}

let shouldFool = false; //(d=>d,getMonth()==3&&d.getDate()==1)(newDate())
function getDefaultWorld() {
	try {
		return shouldFool ? 'aprilFools' : 'main';
	} catch (e) {
		return 'main';
	}
}

export const options = propertyDefaults(userOptions, {
	serverAddress: [{
		default: true,
		title: 'Official Server',
		proto: 'v1',
		url: location.hostname === 'localhost' ? `ws://localhost:8081` : location.href.replace("http", "ws"),
	}],
	fallbackFps: 30,
	maxChatBuffer: 512,
	tickSpeed: 30,
	minGridZoom: 1,
	movementSpeed: 1,
	defaultWorld: getDefaultWorld(),
	enableSounds: true,
	enableIdView: true,
	defaultZoom: 15,
	zoomStrength: 1,
	zoomLimitMin: 1,
	zoomLimitMax: 32,
	unloadDistance: 10,
	toolSetUrl: toolSet,
	unloadedPatternUrl: unloadedPat,
	noUi: false,
	fool: shouldFool,
	backgroundUrl: null,
	hexCoords: false,
	showProtectionOutlines: true,
	showPlayers: true,
});

PublicAPI.options = options;

eventSys.on(EVENTS.net.connecting, server => {
	protocol = server.proto;
})
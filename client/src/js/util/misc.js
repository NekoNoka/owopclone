"use strict";

import { PublicAPI } from "../global.js";

PublicAPI.util = {
	getTime,
	cookiesEnabled,
	storageEnabled,
	absMod,
	escapeHTML,
	mkHTML,
	setTooltip,
	waitFrames,
	line,
	loadScript,
}

export const KeyCode = {
	// Alphabet
	a: 65, b: 66, c: 67, d: 68, e: 69, f: 70, g: 71, h: 72, i: 73,
	j: 74, k: 75, l: 76, m: 77, n: 78, o: 79, p: 80, q: 81, r: 82,
	s: 83, t: 84, u: 85, v: 86, w: 87, x: 88, y: 89, z: 90,

	// Numbers (Top row)
	zero: 48, one: 49, two: 50, three: 51, four: 52,
	five: 53, six: 54, seven: 55, eight: 56, nine: 57,

	// Special characters and symbols
	backtick: 192, tilde: 192, dash: 189, underscore: 189,
	equals: 187, plus: 187, leftBracket: 219, leftCurly: 219,
	rightBracket: 221, rightCurly: 221, backslash: 220, pipe: 220,
	semicolon: 186, colon: 186, quote: 222, doubleQuote: 222,
	comma: 188, lessThan: 188, period: 190, greaterThan: 190,
	slash: 191, question: 191, exclamation: 49, at: 50,
	hash: 51, dollar: 52, percent: 53, caret: 54,
	ampersand: 55, asterisk: 56, leftParen: 57, rightParen: 48,

	// Function keys
	f1: 112, f2: 113, f3: 114, f4: 115, f5: 116, f6: 117,
	f7: 118, f8: 119, f9: 120, f10: 121, f11: 122, f12: 123,

	// Control keys
	enter: 13, space: 32, escape: 27, backspace: 8, tab: 9,
	shift: 16, ctrl: 17, alt: 18, capsLock: 20, pause: 19,

	// Navigation keys
	insert: 45, home: 36, delete: 46, end: 35,
	pageUp: 33, pageDown: 34,

	// Arrow keys
	arrowUp: 38, arrowDown: 40, arrowLeft: 37, arrowRight: 39,

	// Numpad keys
	numpad0: 96, numpad1: 97, numpad2: 98, numpad3: 99,
	numpad4: 100, numpad5: 101, numpad6: 102, numpad7: 103,
	numpad8: 104, numpad9: 105,
	numpadMultiply: 106, numpadAdd: 107, numpadSubtract: 109,
	numpadDecimal: 110, numpadDivide: 111, numpadEnter: 13
};

let time = Date.now();
export function getTime(update) {
	return update ? (time = Date.now()) : time;
}

export function setCookie(name, value) {
	document.cookie = `${name}=${value}; expires=Fri, 31 Dec 99999 23:59:59 GMT`;
}

export function getCookie(name) {
	let cookie = document.cookie.split(';');
	for (let i = 0; i < cookie.length; i++) {
		let index = cookie[i].indexOf(name);
		if (index === 0 || (index === 1 && cookie[i][0] === ' ')) {
			let offset = index + name.length + 1;
			return cookie[i].substring(offset, cookie[i].length);
		}
	}
	return null;
}

export function cookiesEnabled() {
	return navigator.cookieEnabled;
}

export function storageEnabled() {
	try { return !!window.localStorage; }
	catch (e) { return false };
}

export function propertyDefaults(obj, defaults) {
	if (obj) {
		for (let prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				defaults[prop] = obj[prop];
			}
		}
	}
	return defaults;
}

export function absMod(n1, n2) {
	return ((n1 % n2) + n2) % n2;
}

export function HTMLOListElement(html) {
	return mkHTML("template", {
		innerHTML: html
	}).content.firstChild;
}

export function escapeHTML(text) {
	return text.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/\"/g, '&quot;')
		.replace(/\'/g, '&#39;')
		.replace(/\//g, '&#x2F;');
}

export function mkHTML(tag, opts) {
	let element = document.createElement(tag);
	for (let i in opts) {
		element[i] = opts[i];
	}
	return element;
}

export function loadScript(name, callback) {
	document.getElementsByTagName('head')[0].appendChild(mkHTML("script", {
		type: "text/javascript",
		src: name,
		onload: callback,
	}));
}

export function eventOnce(element, events, func) {
	let ev = events.split(' ');
	let f = e => {
		for (let i = 0; i < ev.length; i++) {
			element.removeEventListener(ev[i], f);
		}
		return func();
	};

	for (let i = 0; i < ev.length; i++) {
		element.addEventListener(ev[i], f);
	}
}

let lastTooltipText = '';

export function initializeTooltips() {
	initDOMTooltips();
	let tooltip = document.createElement('div');
	tooltip.id = 'tooltip';
	document.body.appendChild(tooltip);
	tooltip.style.opacity = '0%';
}

export function setTooltip(element, message) {
	element.setAttribute('tooltip', message);
	element.setAttribute('ttApplied', 'true');
	element.addEventListener('mousemove', e => { tooltipHover(e); });
	element.addEventListener('mouseleave', tooltipLeave);
}

function initDOMTooltips() {
	let elements = document.querySelectorAll('[tooltip]');
	for (let element of elements) {
		if (element.getAttribute('ttApplied') == 'true') continue;
		element.addEventListener('mousemove', e => { tooltipHover(e); });
		element.addEventListener('mouseleave', tooltipLeave);
		element.setAttribute('ttApplied', 'true');
	}
}

function tooltipHover(e) {
	const tooltip = document.getElementById('tooltip');
	const tooltipText = e.target.getAttribute('tooltip');
	if (tooltipText != lastTooltipText) {
		tooltip.innerHTML = tooltipText;
		lastTooltipText = tooltipText;
	}
	tooltip.style.opacity = '100%';
	const tipRect = tooltip.getBoundingClientRect();
	let tipX = e.clientX + 20;
	let tipY = e.clientY + 20;
	if (tipX + tipRect.width > window.innerWidth) {
		tipX = e.clientX - tooltip.offsetWidth - 20;
	}

	if (tipY + tipRect.height > window.innerHeight) {
		tipY = e.clientY - tooltip.offsetHeight - 20;
	}

	if (tipY < 0) {
		tipY = 0;
	}

	tooltip.style.top = tipY + 'px';
	tooltip.style.left = tipX + 'px';
}

function tooltipLeave() {
	tooltip.style.opacity = '0%';
}

export function waitFrames(n, cb) {
	window.requestAnimationFrame(() => {
		return n > 0 ? waitFrames(--n, cb) : cb();
	});
}

export function decompress(u8arr) {
	let originalLength = u8arr[1] << 8 | u8arr[0];
	let u8decompressedarr = new Uint8Array(originalLength);
	let numOfRepeats = u8arr[3] << 8 | u8arr[2];
	let offset = numOfRepeats * 2 + 4;
	let uptr = 0;
	let cptr = offset;
	for (let i = 0; i < numOfRepeats; i++) {
		let currentRepeatLoc = (u8arr[4 + i * 2 + 1] << 8 | u8arr[4 + i * 2]) + offset;
		while (cptr < currentRepeatLoc) {
			u8decompressedarr[uptr++] = u8arr[cptr++];
		}
		let repeatedNum = u8arr[cptr + 1] << 8 | u8arr[cptr];
		let repeatedColorR = u8arr[cptr + 2];
		let repeatedColorG = u8arr[cptr + 3];
		let repeatedColorB = u8arr[cptr + 4];
		cptr += 5;
		while (repeatedNum--) {
			u8decompressedarr[uptr] = repeatedColorR;
			u8decompressedarr[uptr + 1] = repeatedColorG;
			u8decompressedarr[uptr + 2] = repeatedColorB;
			uptr += 3;
		}
	}
	while (cptr < u8arr.length) {
		u8decompressedarr[uptr++] = u8arr[cptr++];
	}
	return u8decompressedarr;
}

export function line(x1, y1, x2, y2, size, plot) {
	var dx = Math.abs(x2 - x1), sx = x1 < x2 ? 1 : -1;
	var dy = -Math.abs(y2 - y1), sy = y1 < y2 ? 1 : -1;
	var err = dx + dy,
		e2;

	while (true) {
		plot(x1, y1);
		if (x1 == x2 && y1 == y2) break;
		e2 = 2 * err;
		if (e2 >= dy) { err += dy; x1 += sx; }
		if (e2 <= dx) { err += dx; y1 += sy; }
	}
}

document.addEventListener("DOMContentLoaded", initializeTooltips);
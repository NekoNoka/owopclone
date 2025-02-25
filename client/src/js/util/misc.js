'use strict';
import { colorUtils as color } from './color';
import { PublicAPI } from '../global';

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

let time = Date.now();
export function getTime(update){
	return update ? (time = Date.now()) : time;
}

export function setCookie(name, value){
	document.cookie = `${name}=${value}; expires=Fri, 31 Dec 99999 23:59:59 GMT`;
}

export function getCookie(name){
	let cookie = document.cookie.split(';');
	for (let i=0;i<cookie.length;i++){
		let index = cookie[i].indexOf(name);
		if(index===0||(index===1&&cookie[i][0]===' ')){
			let offset = index + name.length + 1;
			return cookie[i].substring(offset,cookie[i].length);
		}
	}
	return null;
}

export function cookiesEnabled(){
	return navigator.cookieEnabled;
}

export function storageEnabled(){
	try{return !!window.localStorage;}
	catch(e){return false};
}

export function propertyDefaults(obj, defaults){
	if(obj){
		for(let prop in obj){
			if(obj.hasOwnProperty(prop)){
				defaults[prop]=obj[prop];
			}
		}
	}
	return defaults;
}

export function absMod(n1, n2){
	return((n1 % n2) + n2) % n2;
}

export function HTMLOListElement(html){
	return mkHTML("template", {
		innerHTML: html
	}).content.firstChild;
}

export function escapeHTML(text){
	return text.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/\"/g, '&quot;')
		.replace(/\'/g, '&#39;')
		.replace(/\//g, '&#x2F;');
}

export function mkHTML(tag, opts){
	let element = document.createElement(tag);
	for(let i in opts){
		element[i]=opts[i];
	}
	return element;
}

export function loadScript(name, callback){
	document.getElementsByTagName('head')[0].appendChild(mkHTML("script", {
		type: "text/javascript",
		src: name,
		onload: callback,
	}));
}

export function eventOnce(element, events, func){
	let ev = events.split(' ');
	let f = e => {
		for(let i=0;i<ev.length;i++){
			element.removeEventListener(ev[i], f);
		}
		return func();
	};

	for(let i=0;i<ev.length;i++){
		element.addEventListener(ev[i], f);
	}
}

let lastTooltipText = '';

export function initializeTooltips(){
	initDOMTooltips();
	let tooltip = document.createElement('div');
	tooltip.id = 'tooltip';
	document.body.appendChild(tooltip);
	tooltip.style.opacity = '0%';
}

export function setTooltip(element, message){
	element.setAttribute('tooltip', message);
	element.setAttribute('ttApplied', 'true');
	element.addEventListener('mousemove', e=>{tooltipHover(e);});
	element.addEventListener('mouseleave', tooltipLeave);
}

function initDOMTooltips(){
	let elements = document.querySelectorAll('[tooltip]');
	for(let element of elements){
		if(element.getAttribute('ttApplied')=='true') continue;
		element.addEventListener('mousemove', e=>{tooltipHover(e);});
		element.addEventListener('mouseleave', tooltipLeave);
		element.setAttribute('ttApplied', 'true');
	}
}

function tooltipHover(e){
	const tooltip = document.getElementById('tooltip');
	const tooltipText = e.target.getAttribute('tooltip');
	if(tooltipText!=lastTooltipText){
		tooltip.innerHTML = tooltipText;
		lastTooltipText = tooltipText;
	}
	tooltip.style.opacity = '100%';
	const tipRect = tooltip.getBoundingClientRect();
	let tipX = e.clientX+20;
	let tipY = e.clientY+20;
	if(tipX+tipRect.width>window.innerWidth){
		tipX=e.clientX-tooltip.offsetWidth-20;
	}

	if(tipY+tipRect.height>window.innerHeight){
		tipY=e.clientY-tooltip.offsetHeight-20;
	}

	if(tipY<0) {
		tipY = 0;
	}

	tooltip.style.top = tipY+'px';
	tooltip.style.left = tipX+'px';
}

function tooltipLeave(){
	tooltip.style.opacity = '0%';
}

export function waitFrames(n, cb){
	window.requestAnimationFrame(()=>{
		return n>0?waitFrames(--n,cb):cb();
	});
}

export function decompress(u8arr){
	let originalLength = u8arr[1] << 8 | u8arr[0];
	let u8decompressedarr = new Uint8Array(originalLength);
	let numOfRepeats = u8arr[3] << 8 | u8arr[2];
	let offset = numOfRepeats * 2 + 4;
	let uptr = 0;
	let cptr = offset;
	for(let i=0;i<numOfRepeats;i++){
		let currentRepeatLoc = (u8arr[4+i*2+1]<<8|u8arr[4+i*2])+offset;
		while(cptr<currentRepeatLoc){
			u8decompressedarr[uptr++]=u8arr[cptr++];
		}
		let repeatedNum = u8arr[cptr+1]<<8|u8arr[cptr];
		let repeatedColorR = u8arr[cptr+2];
		let repeatedColorG = u8arr[cptr+3];
		let repeatedColorB = u8arr[cptr+4];
		cptr+=5;
		while(repeatedNum--){
			u8decompressedarr[uptr]=repeatedColorR;
			u8decompressedarr[uptr+1]=repeatedColorG;
			u8decompressedarr[uptr+2]=repeatedColorB;
			uptr+=3;
		}
	}
	while(cptr<u8arr.length){
		u8decompressedarr[uptr++]=u8arr[cptr++];
	}
	return u8decompressedarr;
}

export function line(x1, y1, x2, y2, size, plot) {
	var dx =  Math.abs(x2 - x1), sx = x1 < x2 ? 1 : -1;
	var dy = -Math.abs(y2 - y1), sy = y1 < y2 ? 1 : -1;
	var err = dx + dy,
		e2;

	while(true) {
		plot(x1, y1);
		if (x1 == x2 && y1 == y2) break;
		e2 = 2 * err;
		if (e2 >= dy) { err += dy; x1 += sx; }
		if (e2 <= dx) { err += dx; y1 += sy; }
	}
}

document.addEventListener("DOMContentLoaded", initializeTooltips);
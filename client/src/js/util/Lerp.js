'use strict';
import { getTime } from './misc';

const time = getTime;

export class Lerp {
	constructor(start, end, ms) {
		this.start = start;
		this.end = end;
		this.ms = ms;
		this.time = time();
	}

	get val() {
		let amt = Math.min((time() - this.time) / this.ms, 1);
		return (1 - amt) * this.start + amt * this.end;
	}

	set val(v) {
		this.start = this.val;
		this.end = v;
		this.time = time(true);
	}
}
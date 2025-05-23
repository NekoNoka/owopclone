import { RANK } from '../util/util.js';
import { Client } from './Client.js';

export class ServerClientManager{
	constructor(server){
		this.server = server;
		this.map = new Map();

		this.incrementingId = 0;

		this.destroyed = false;
	}

	destroy(reason){
		if(this.destroyed) return;
		this.destroyed = true;
		for(let client of this.map.values()){
			if(reason) client.destroyWithReason(reason);
			else client.destroy();
		}
	}

	clientDestroyed(client){
		let clientId = client.id;
		this.map.delete(clientId);
		if(client.rank>=RANK.ADMIN&&client.ip.isWhitelisted()&&this.server.lockdown){
			this.server.checkLockdown();
		}
	}

	createClient(ws){
		let id = this.incrementingId++;
		let client = new Client(this, ws, id);
		this.map.set(id, client);
		return client;
	}

	tickExpiration(tick){
		for(let client of this.map.values()){
			if(!client.keepAlive(tick)) client.destroy();
		}
	}

	tick(tick){
		for(let client of this.map.values()){
			client.tick(tick);
		}
	}
}
import { Region } from '../region/Region.js';
import { RANK } from '../util/util.js';
import { DEFAULT_PROPS } from '../util/util.js';
import { Property } from '../util/Property.js';

let textEncoder = new TextEncoder();

export class World {
	constructor(serverWorldManager, name, data) {
		this.serverWorldManager = serverWorldManager;
		this.server = serverWorldManager.server;

		this.name = name;
		let nameBuffer = Buffer.from(name);
		let topicBuffer = Buffer.allocUnsafeSlow(nameBuffer.length + 1);
		topicBuffer[0] = 0x02;
		nameBuffer.copy(topicBuffer, 1);
		this.wsTopic = topicBuffer.buffer;

		this.clients = new Map();
		this.regions = new Map();

		this.restricted = new Property("restricted");
		this.pass = new Property("pass");
		this.modpass = new Property("modpass");
		this.adminpass = new Property("adminpass");
		this.pquota = new Property("pquota");
		this.motd = new Property("motd");
		this.bgcolor = new Property("bgcolor");
		this.doubleModPquota = new Property("doubleModPquota");
		this.pastingAllowed = new Property("pastingAllowed");
		this.maxPlayers = new Property("maxPlayers");
		this.maxTpDistance = new Property("maxTpDistance");
		this.modPrefix = new Property("modPrefix");
		this.simpleMods = new Property("simpleMods");
		this.allowGlobalMods = new Property("allowGlobalMods");
		this.stickyImage = new Property("stickyImage");
		this.stickyImageSize = new Property("stickyImageSize");
		this.stickyImageOpacity = new Property("stickyImageOpacity");
		this.bannedIps = [];


		this.dataModified = false;
		if (!!data) {
			data = JSON.parse(data);
			for (let key in data.properties) {
				this[key].value = data.properties[key];
			}
			this.bannedIps = !!data.bannedIps ? data.bannedIps : [];
		}

		this.incrementingId = 1;

		this.updateAllPlayers = false;
		this.playerUpdates = new Set();
		this.pixelUpdates = [];
		this.playerDisconnects = new Set();

		this.lastHeld = this.server.currentTick;
		this.destroyed = false;
	}

	destroy() {
		if (this.destroyed) return;
		// console.log("destroying");
		this.destroyed = true;
		for (let region of this.regions.values()) {
			region.destroy();
		}
		if (!this.dataModified) {
			this.serverWorldManager.worldDestroyed(this);
			return;
		}
		let data = {
			properties: {
				restricted: this.restricted.value,
				pass: this.pass.value,
				modpass: this.modpass.value,
				pquota: this.pquota.value,
				motd: this.motd.value,
				bgcolor: this.bgcolor.value,
				doubleModPquota: this.doubleModPquota.value,
				pastingAllowed: this.pastingAllowed.value,
				maxPlayers: this.maxPlayers.value,
				maxTpDistance: this.maxTpDistance.value,
				modPrefix: this.modPrefix.value,
				allowGlobalMods: this.allowGlobalMods.value,
				simpleMods: this.simpleMods.value,
				stickyImage: this.stickyImage.value,
				stickyImageSize: this.stickyImageSize.value,
				stickyImageOpacity: this.stickyImageOpacity.value,
				adminpass: this.adminpass.value,
			},
			bannedIps: this.bannedIps,
		};
		this.serverWorldManager.worldDestroyed(this, JSON.stringify(data));
	}

	getClient(self, targetId) {
		if (["0", "self", "me", "myself", "this", "@s", "imlazy"].includes(targetId.toLowerCase())) return self;
		let target = this.clients.get(parseInt(targetId));
		if (!target) return null;
		return target;
	}

	setProp(key, value) {
		this[key].value = value;
		this.dataModified = true;
	}

	keepAlive(tick) {
		if (this.clients.size > 0) return true;
		if (tick - this.lastHeld < 150) return true;
		return false;
	}

	broadcastBuffer(buffer) {
		let arrayBuffer = buffer.buffer;
		this.server.wsServer.publish(this.wsTopic, arrayBuffer, true);
	}

	broadcastMessage(message) {
		this.server.wsServer.publish(this.wsTopic, JSON.stringify(message), false);
	}

	isFull() {
		return this.clients.size >= this.maxPlayers;
	}

	async addClient(client) {
		console.log(client.accountInfo.data.user.owopData);
		// console.log(client.accountInfo.data.user.owopData.worlds.length);
		client.setStatus("Fetching world data...", true, true);
		if(!client.accountInfo.data.user.owopData.worlds.length || !client.accountInfo.data.user.owopData.worlds.some(entry=>entry.worldName===this.name)){
			if(await client.createWorldData(this.name)) {
				client.setStatus("Fetching world data...", true, true);
				await client.fetchUserInfo();
			}
			else return client.destroyWithReason("Failed to create world data.");
		}
		client.setStatus("Got world data.", true, false);
		for(let bannedIp in this.bannedIps){
			if(this.bannedIps[bannedIp].ip===client.ip.ip){
				// console.log("banned")
				// console.log(bannedIp);
				if(this.bannedIps[bannedIp].time===-1){
					client.sendMessage({
						sender: 'server',
						data: {
							type: 'error',
						},
						text: `You are banned from this world${this.bannedIps[bannedIp].reason?`with reason: ${this.bannedIps[bannedIp].reason}`:'.'} ${client.server.config.appealMessage}`,
					});
					client.destroy();
					return;
				}
				if(this.bannedIps[bannedIp].time>Date.now()){
					client.sendMessage({
						sender: 'server',
						data: {
							type: 'error',
						},
						text: `Remaining time: ${Math.floor((this.bannedIps[bannedIp].time - Date.now()) / 1000)} seconds.`
					});
					client.sendMessage({
						sender: 'server',
						data: {
							type: 'error',
						},
						text: `You are banned from this world${this.bannedIps[bannedIp].reason?`with reason: ${this.bannedIps[bannedIp].reason}`:'.'} ${client.server.config.appealMessage}`,
					});
					client.destroy();
					return;
				}
				// console.log("unbanned");
				this.bannedIps.splice(this.bannedIps.indexOf(this.bannedIps[bannedIp]), 1);
				this.dataModified = true;
				break;
			}
		}
		let id = this.incrementingId++;
		this.clients.set(id, client);
		client.world = this;
		client.ws.subscribe(this.wsTopic);
		client.setUid(id);
		if (this.motd.value) client.sendMessage({
			sender: 'world',
			data: {
				type: 'motd'
			},
			text: this.motd.value
		});
		client.lastUpdate = this.server.currentTick;
		this.updateAllPlayers = true;
		if (this.restricted.value) return;
		if (this.pass.value) {
			client.sendMessage({
				sender: 'server',
				data: {
					type: 'info'
				},
				text: '[Server]: This world has a password set. Use \'/pass PASSWORD\' to unlock drawing.'
			});
			return;
		}
		
		client.setRank(client.getTargetRank());
		if (this.stickyImage.value) client.sendMessage({
			sender: 'world',
			data: {
				type: 'spawnStickyImage',
				imageURL: this.stickyImage.value,
				imageSize: this.stickyImageSize.value.split("x").map(value => parseInt(value)),
				imageOpacity: this.stickyImageOpacity.value,
			}
		});
	}

	removeClient(client) {
		this.clients.delete(client.uid);
		this.playerDisconnects.add(client.uid);
		this.playerUpdates.delete(client);
		if (this.clients.size === 0) this.lastHeld = this.server.currrentTick;
	}

	sendChat(client, message, sender = 'player', data = null) {
		if (!data) {
			data = {
				senderId: client.uid,
				senderNick: client.getNick(),
				senderRank: client.rank,
				isLocalStaff: client.localStaff,
				type: 'chatMessage',
			};
		}
		this.broadcastMessage({
			sender,
			data,
			text: message
		});
	}

	ban(client, time, reason) {
		this.bannedIps.push({
			ip: client.ip.ip,
			time,
			reason
		});
		client.destroy();
		this.dataModified = true;
	}

	getRegion(id) {
		if (this.regions.has(id)) return this.regions.get(id);
		let region = new Region(this, id);
		this.regions.set(id, region);
		return region;
	}

	regionDestroyed(id) {
		this.regions.delete(id);
	}

	tickExpiration(tick) {
		for (let region of this.regions.values()) {
			if (!region.keepAlive(tick)) region.destroy();
		}
	}

	tick(tick) {
		if (!this.udpateAllPlayers && this.playerUpdates.size === 0 && this.pixelUpdates === 0 && this.playerDisconnects.size === 0) return;
		if (this.updateAllPlayers) {
			this.updateAllPlayers = false;
			for (let client of this.clients.values()) {
				if (!client.stealth) this.playerUpdates.add(client);
			}
		}
		let playerUpdateCount = Math.min(this.playerUpdates.size, 255);
		let pixelUpdateCount = this.pixelUpdates.length;
		let disconnectCount = Math.min(this.playerDisconnects.size, 255);
		let buffer = Buffer.allocUnsafeSlow(playerUpdateCount * 16 + pixelUpdateCount * 15 + disconnectCount * 4 + 5);
		buffer[0] = 0x01;
		buffer[1] = playerUpdateCount;
		let pos = 2;
		let count = 0;
		for (let client of this.playerUpdates) {
			buffer.writeUint32LE(client.uid, pos);
			pos += 4;
			buffer.writeInt32LE(client.x, pos);
			pos += 4;
			buffer.writeInt32LE(client.y, pos);
			pos += 4;
			buffer[pos++] = client.r;
			buffer[pos++] = client.g;
			buffer[pos++] = client.b;
			buffer[pos++] = client.tool;
			this.playerUpdates.delete(client);
			if (++count === 255) break;
		}
		buffer.writeUint16LE(pixelUpdateCount, pos);
		pos += 2;
		for (let updateBuffer of this.pixelUpdates) {
			updateBuffer.copy(buffer, pos);
			pos += 15;
		}
		buffer[pos++] = disconnectCount;
		count = 0;
		for (let id of this.playerDisconnects) {
			buffer.writeUint32LE(id, pos);
			pos += 4;
			this.playerDisconnects.delete(id);
			if (++count === 255) break;
		}
		this.pixelUpdates = [];
		this.broadcastBuffer(buffer);
	}

	kickNonAdmins() {
		let count = 0;
		for (let client of this.clients.values()) {
			if (client.rank >= RANK.ADMIN) continue;
			client.destroy();
			count++;
		}
		return count;
	}
}
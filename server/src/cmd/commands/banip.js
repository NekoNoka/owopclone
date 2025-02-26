import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'banip',
		description: 'Ban a user from the server. If you are a global admin you can ban site-wide. time is done in hours.',
		usage: 'banid <world/global> <ip> [time] [reason]',
		aliases: [],
		minRank: RANK.ADMIN,
	},
	async execute(client, args) {
		if (!args.length) return client.sendMessage({
			sender: 'server',
			data: {
				type: 'error',
			},
			text: `Usage: /${this.data.usage}`
		});
		if (client.localStaff) return client.sendMessage({
			sender: 'server',
			data: {
				type: 'error',
			},
			text: `Only global admins have access to this command.`
		});
		if (args.length < 2) return client.sendMessage({
			sender: 'server',
			data: {
				type: 'error',
			},
			text: `Usage: /${this.data.usage}`
		});
		let type = args[0].toLowerCase();
		if (type !== 'global' && type !== 'world') return client.sendMessage({
			sender: 'server',
			data: {
				type: 'error',
			},
			text: `Invalid type. Usage: /${this.data.usage}`
		});
		let target = client.server.ips.map.get(args[1]);
		if (!target) return client.sendMessage({
			sender: 'server',
			data: {
				type: 'error',
			},
			text: `Invalid user id. Usage: /${this.data.usage}`
		});
		let time = parseInt(args[2]);
		if (time) {
			if (!(time > 0 || time === -1)) return client.sendMessage({
				sender: 'server',
				data: {
					type: 'error',
				},
				text: `Invalid time. Must be greater than 0 or -1 (for permanent). Usage: /${this.data.usage}`
			});
		}
		let reason = args.slice(3).join(" ");
		target.sendMessage({
			sender: 'server',
			data: {
				type: 'error',
			},
			text: `You were banned from the ${type === 'global' ? 'server' : `world ${client.world.name}`}. ${reason ? `Reason: ${reason}` : ""}`
		});
		let expirationTime = (time === null || isNaN(time)) ? -1 : time === -1 ? -1 : Date.now() + time * 60000;
		console.log(expirationTime);
		if (type === 'global') {
			client.server.adminMessage(`DEVBanned ${target.uid} (${target.world.name}, ${target.ip.ip}) from the server.`);
			return target.ip.ban(expirationTime);
		}
		target.server.adminMessage(`DEVBanned ${target.uid} (${target.world.name}, ${target.ip.ip}) from world ${client.world.name}.`);
		return target.world.ban(target, expirationTime, reason);
	}
}
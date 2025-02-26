import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'bans',
		description: 'shows all users banned from the world. shows globally banned users if global admin or higher.',
		usage: 'bans',
		aliases: [],
		minRank: RANK.ADMIN,
	}, async execute(client, args){
		client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Currently banned users: ${client.world.bannedIps.length?client.world.bannedIps.map(ip=>ip.ip).join(", "):"None"}`
		});
		if(client.localStaff) return;
		let ips = client.server.ips.map.map(entry => entry.ip);
		client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Globally banned users: ${ips.length?ips.join(", "):"None"}`
		});
	}
}
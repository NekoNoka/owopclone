import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'whois',
		description: 'Gets information about a user or about yourself',
		usage: 'whois [user]',
		aliases: [],
		minRank: RANK.NONE,
		alwaysHidden: false,
	}, async execute(client, args){
		let target;
		if(!args.length) target = client;
		else target = client.world.clients.get(parseInt(args[0]));
		if(!target) return client.sendMessage({
			sender: 'server',
			data: {
				type: 'error',
			},
			text: `Unknown user.`
		});
		client.sendMessage({
			sender: 'server',
			data: {
				type: 'info',
			},
			text: `Client information for ${target===client?'self':target.uid}:`
		});
		if(target===client || client.rank>=RANK.ADMIN){
			client.sendMessage({
				sender: 'notif',
				data: {
					type: 'info',
				},
				text: `IP: ${target.ip.ip}`
			});
			client.sendMessage({
				sender: 'notif',
				data: {
					type: 'info',
				},
				text: `Connections: ${target.ip.clients.size}`
			});
			client.sendMessage({
				sender: 'notif',
				data: {
					type: 'info',
				},
				text: `Origin Header: ${target.ws.origin}`
			});
			client.sendMessage({
				sender: 'notif',
				data: {
					type: 'info',
				},
				text: `Rank: ${target.rank}`
			});
			client.sendMessage({
				sender: 'notif',
				data: {
					type: 'info',
				},
				text: `Nickname: ${target.getNick()}`
			});
		}
	}
}
import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'unban',
		description: 'Unban a user from the server. If you are a global admin you can unban site-wide.',
		usage: 'banid [[<world/global>]] <id>',
		aliases: [],
		minRank: RANK.ADMIN,
	},
	async execute(client, args){
		if(!args.length) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Usage: /${this.data.usage}`
		});
		if(!client.localStaff){
			if(args.length<2) return client.sendMessage({
				sender: 'server',
				data:{
					type: 'error',
				},
				text: `Usage: /${this.data.usage}`
			});
			let type = args[0].toLowerCase();
			if(type!=='global'&&type!=='world') return client.sendMessage({
				sender: 'server',
				data:{
					type: 'error',
				},
				text: `Invalid type. Usage: /${this.data.usage}`
			});
			// get ip
			let target = await client.server.ips.fetch(args[1]);
			if(!target) return client.sendMessage({
				sender: 'server',
				data:{
					type: 'error',
				},
				text: `IP not found. Usage: /${this.data.usage}`
			});
			console.log(target);
			if(type==='global'){
				target.setProp("banExpiration", 0);
				return client.sendMessage({
					sender: 'server',
					data:{
						type: 'info',
					},
					text: `Globally unbanned ${target.ip}.`
				});
			}
			if(!client.world.bannedIps.map(entry => entry.ip).includes(target.ip)) return client.sendMessage({
				sender: 'server',
				data:{
					type: 'error',
				},
				text: `IP not banned from world ${client.world.name}. Usage: /${this.data.usage}`
			});
			client.world.bannedIps.splice(client.world.bannedIps.indexOf(target), 1);
			client.sendMessage({
				sender: 'server',
				data:{
					type: 'info',
				},
				text: `Unbanned ${target.ip} from world ${client.world.name}.`
			});
		}
		let target = await client.server.ips.fetch(args[1]);
		if(!target) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Invalid user id. Usage: /${this.data.usage}`
		});
		if(!obj.map(entry => entry.ip).includes(target.ip)) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `IP not banned from world ${client.world.name}. Usage: /${this.data.usage}`
		});
		this.world.bannedIps.splice(this.world.bannedIps.indexOf(target), 1);
		client.sendMessage({
			sender: 'server',
			data:{
				type: 'info',
			},
			text: `Unbanned ${target.ip} from world ${client.world.name}.`
		});
	}
}
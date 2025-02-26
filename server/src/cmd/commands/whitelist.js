import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'whitelist',
		description: 'Adds a user to the whitelist.',
		usage: 'whitelist (<clear>/<add/remove/check> <ip>)',
		aliases: [],
		minRank: RANK.DEVELOPER,
	},
	async execute(client, args){
		if(!args.length) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Usage: /${this.data.usage}`
		});
		let type = args[0].toLowerCase();
		if(type==="clear"){
			client.server.resetWhitelist();
			return client.sendMessage({
				sender: 'server',
				data:{
					type: 'info',
				},
				text: `Cleared whitelist.`
			});
		}
		if(type==="add"){
			if(!args[1]) return client.sendMessage({
				sender: 'server',
				data:{
					type: 'error',
				},
				text: `Usage: /${this.data.usage}`
			});
			let target = await client.server.ips.fetch(args[1]);
			if(!target) return client.sendMessage({
				sender: 'server',
				data:{
					type: 'error',
				},
				text: `IP not found. Usage: /${this.data.usage}`
			});
			target.setProp("whitelist",client.server.whitelistId);
			return client.sendMessage({
				sender: 'server',
				data:{
					type: 'info',
				},
				text: `Added ${target.ip} to whitelist.`
			});
		}
		if(type==="remove"){
			if(!args[1]) return client.sendMessage({
				sender: 'server',
				data:{
					type: 'error',
				},
				text: `Usage: /${this.data.usage}`
			});
			let target = await client.server.ips.fetch(args[1]);
			if(!target) return client.sendMessage({
				sender: 'server',
				data:{
					type: 'error',
				},
				text: `IP not found. Usage: /${this.data.usage}`
			});
			target.setProp("whitelist",-1);
			return client.sendMessage({
				sender: 'server',
				data:{
					type: 'info',
				},
				text: `Removed ${target.ip} from whitelist.`
			});
		}
		if(type==="check"){
			if(!args[1]) return client.sendMessage({
				sender: 'server',
				data:{
					type: 'error',
				},
				text: `Usage: /${this.data.usage}`
			});
			let target = await client.server.ips.fetch(args[1]);
			if(!target) return client.sendMessage({
				sender: 'server',
				data:{
					type: 'error',
				},
				text: `IP not found. Usage: /${this.data.usage}`
			});
			return client.sendMessage({
				sender: 'server',
				data:{
					type: 'info',
				},
				text: `IP ${target.ip} is ${target.whitelist===client.server.whitelistId?"whitelisted":"not whitelisted"}.`
			});
		}
	}
}
import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'kickall',
		description: 'Kick all non admins from the world or the server if you are a global admin.',
		usage: 'kickall | <world/global>',
		aliases: [],
		minRank: RANK.ADMIN,
	},
	async execute(client, args){
		if(client.localStaff){
			let count = client.world.kickNonAdmins();
			return client.sendMessage({
				sender: 'server',
				data:{
					type: 'info',
				},
				text: `Kicked ${count} non-admins from world ${client.world.name}.`
			});
		}
		if(!args.length) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Usage: /${this.data.usage}`
		});
		if(args[0]!=="global"&&args[0]!=="world") return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Invalid type. Usage: /${this.data.usage}`
		});
		if(args[0]==="global"){
			let count = client.server.kickNonAdmins();
			return client.sendMessage({
				sender: 'server',
				data:{
					type: 'info',
				},
				text: `Kicked ${count} non-admins from the server.`
			});
		}
		let count = client.world.kickNonAdmins();
		return client.sendMessage({
			sender: 'server',
			data:{
				type: 'info',
			},
			text: `Kicked ${count} non-admins from world ${client.world.name}.`
		});
	}
}
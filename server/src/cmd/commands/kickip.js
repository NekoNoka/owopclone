import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'kickip',
		description: 'Kick a user from the server.',
		usage: 'kickip <ip> [reason]',
		aliases: ['kip'],
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
		let target = client.server.ips.map.get(args[0]);
		if(!target || target.constructor===Promise || target.clients.size===0) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `No online clients found for that IP. Usage: /${this.data.usage}`
		});
		if(target===client.ip) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `You can't kick yourself.`
		});
		let reason = args.slice(1).join(" ");
		for(let c of target.clients.values()){
			await c.sendMessage({
				sender: 'server',
				data:{
					type: 'error',
				},
				text: `You were kicked from the server. ${reason ? `Reason: ${reason}` : ""}`
			});
		}
		target.kick();
		if(!client.destroyed){
			client.sendMessage({
				sender: 'server',
				data:{
					type: 'error',
				},
				text: `Kicked ${target.ip} from all worlds ${reason ? ` with reason: ${reason}.` : "."}`
			});
		}
	}
}
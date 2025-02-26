import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'setworldpass',
		description: 'set the password for the world',
		usage: 'setworldpass <password/"remove">',
		aliases: ['setwp'],
		minRank: RANK.MODERATOR,
	},
	async execute(client, args){
		if(client.rank<RANK.ADMIN&&client.world.simpleMods.value) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: 'Simple mods are enabled, no setworldpass for u :3'
		});
		if(!args.length) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Usage: /${this.data.usage}`
		});
		let value = args.join(" ").trim();
		if(value==="remove"){
			client.world.setProp("pass",null);
			return client.sendMessage({
				sender: 'server',
				data:{
					type: 'info',
				},
				text: 'Removed the world password.'
			});
		}
		if(!value) return;
		client.world.setProp("pass",value);
		return client.sendMessage({
			sender: 'server',
			data:{
				type: 'info',
			},
			text: `Set the world password to ${value}.`
		});
	}
}
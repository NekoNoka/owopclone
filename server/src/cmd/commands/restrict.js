import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'restrict',
		description: 'Restricts drawing for all NEW users to the world. Can manually grant permission with /setrank <id> 1.',
		usage: 'restrict <true/false>',
		aliases: [],
		minRank: RANK.MODERATOR,
	},
	async execute(client, args){
		if(!args.length) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Usage: /${this.data.usage}`
		});
		let newstate = args[0]==="true";
		client.world.restricted.value = newstate;
		client.sendMessage({
			sender: 'server',
			data:{
				type: 'info',
			},
			text: `Draw restriction is now ${newstate?"enabled":"disabled"}.`
		});
	}
}
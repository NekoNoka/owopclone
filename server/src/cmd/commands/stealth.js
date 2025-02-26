import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'stealth',
		description: 'toggle stealth mode, prevents broadcasting movement updates',
		usage: 'stealth <true/false>',
		aliases: ['sneak'],
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
		let newstate = args[0]==="true";
		client.stealth = newstate;
		client.sendMessage({
			sender: 'server',
			data:{
				type: 'info',
			},
			text: `${newstate?"Enabled":"Disabled"} stealth mode.`
		});
	}
}
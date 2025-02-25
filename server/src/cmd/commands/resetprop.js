import { RANK } from "../../util/util.js";
import { DEFAULT_PROPS } from "../../util/util.js";

export default {
	data: {
		name: 'resetprop',
		description: 'resets worldprop to default',
		usage: 'resetprop <prop>',
		aliases: [],
		minRank: RANK.ADMIN,
	}, async execute(client, args){
		if(!args.length) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Usage: /${this.data.usage}`
		});
		for(let prop in DEFAULT_PROPS){
			if(prop.toLowerCase()===args[0].toLowerCase()){
				client.world[prop] = DEFAULT_PROPS[prop];
				return client.sendMessage({
					sender: 'server',
					data:{
						type: 'info',
					},
					text: `Reset ${prop} to default.`
				});
			}
		}
		return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Invalid prop. Usage: /${this.data.usage}`
		});
	}
}
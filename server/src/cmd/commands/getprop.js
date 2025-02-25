import { RANK } from "../../util/util.js";
import { DEFAULT_PROPS } from "../../util/util.js";
import { formatPropValue } from "../../util/util.js";

export default {
	data: {
		name: 'getprop',
		description: 'gets worldprop',
		usage: 'getprop <prop>',
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
				let value = client.world[prop];
				if(value===null) return client.sendMessage({
					sender: 'server',
					data:{
						type: 'info',
					},
					text: `${prop}: <no value>`
				});
				let formatted = formatPropValue(prop, value);
				return client.sendMessage({
					sender: 'server',
					data:{
						type: 'info',
					},
					text: `${prop}: ${formatted}`
				});
			}
		}
		client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Invalid prop. Usage: /${this.data.usage}`
		});
	}
}
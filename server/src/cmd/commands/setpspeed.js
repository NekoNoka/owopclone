import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'setpspeed',
		description: 'sets speed of pixel bucket',
		usage: 'setpspeed <id> <speed>',
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
		let target = client.world.getClient(client, args[0]);
		if(!target) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Invalid user id. Usage: /${this.data.usage}`
		});
		let speed = parseInt(args[1]);
		if(!(speed>=0&&speed<=65535)) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Invalid speed. Must be between 0 and 65535. Usage: /${this.data.usage}`
		});
		// target.sendMessage({
		// 	sender: 'server',
		// 	data:{
		// 		type: 'pSpeedUpdate',
		// 		speed
		// 	},
		// });
		target.sendMessage({
			sender: 'notif',
			data:{
				// type: 'notif',
				eval: `NWOP.tools.allTools.fill.extra.tickAmount = ${speed};`
			},
			text: `Your pixel bucket speed has been set to ${speed}.`
		});
		client.sendMessage({
			sender: 'server',
			data:{
				type: 'info',
			},
			text: `Set ${target.uid}'s pixel bucket speed to ${speed}.`
		});
	}
}
import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'setpbucket',
		description: 'sets a client\'s drawing limit. (RATE pixels every PER seconds. no floats.)',
		usage: 'setpbucket <ID> <rate> <per>',
		aliases: [],
		minRank: RANK.ADMIN,
	}, async execute(client, args){
		if(!args.length) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `${this.data.description}\nUsage: /${this.data.usage}`
		});
		let target = client.world.getClient(client, args[0]);
		if(!target) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Invalid user id. Usage: /${this.data.usage}`
		});
		let amount = parseInt(args[1]);
		if(!(amount>=0&&amount<=65535)) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Invalid amount. Must be between 0 and 65535. Usage: /${this.data.usage}`
		});
		let seconds = parseInt(args[2]);
		if(!(seconds>=0&&amount<=65535)) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Invalid rate. Must be between 0 and 65535. Usage: /${this.data.usage}`
		});
		target.setPquota(amount, seconds);
		client.sendMessage({
			sender: 'server',
			data:{
				type: 'info',
			},
			text: `Set ${target.uid}'s drawing limit to ${amount} pixels every ${seconds} seconds.`
		});
	}
}
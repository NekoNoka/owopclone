import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'tellraw',
		description: 'send raw html to a specific user',
		usage: 'tell <user> <message>',
		aliases: ['tr'],
		minRank: RANK.DEVELOPER,
	}, async execute(client, args){
		if(args.length < 2) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Usage: /${this.data.usage}`
		});
		let target = client.world.clients.get(parseInt(args[0]));
		if(!target) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Invalid user id. Usage: /${this.data.usage}`
		});
		if(target===client) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `You can't send a message to yourself.`
		});
		let message = args.slice(1).join(" ");
		target.sendMessage({
			sender: 'rawChat',
			data: {}, 
			text: message
		});
		client.sendMessage({
			sender: 'notif',
			data:{
				type: 'whisperSent',
				targetId: target.uid,
			},
			text: message
		});
	}
}
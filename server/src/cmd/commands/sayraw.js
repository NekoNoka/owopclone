import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'sayraw',
		description: 'send raw html to all players in world',
		usage: 'sayraw <message>',
		aliases: ['sr'],
		minRank: RANK.ADMIN,
	}, async execute(client, args){
		if(client.localStaff) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Only global admins have access to this command.`
		});
		if(!args.length) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Usage: /${this.data.usage}`
		});
		client.world.sendChat(client, args.join(" "), 'rawChat');
	}
}
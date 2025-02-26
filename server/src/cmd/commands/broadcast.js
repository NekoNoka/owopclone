import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'broadcast',
		description: 'broadcasts a message to all connected clients',
		usage: 'broadcast <message>',
		aliases: [],
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
		client.server.sendBroadcast(client, args.join(" "));
	}
}
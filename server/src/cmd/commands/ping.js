import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'ping',
		description: 'Pings the server',
		usage: 'ping',
		aliases: [],
		minRank: RANK.NONE,
		alwaysHidden: false,
	}, async execute(client, args){
		client.sendMessage({
			sender: 'server',
			data: {
				type: 'info',
				action: 'ping',
			},
			text: '[Server]: Pong!'
		});
	}
}
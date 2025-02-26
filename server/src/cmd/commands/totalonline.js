import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'totalonline',
		description: 'shows the total number players connected to the server',
		usage: 'totalonline',
		aliases: [],
		minRank: RANK.NONE,
	}, async execute(client, args){
		client.sendMessage({
			sender: 'server',
			data:{
				type: 'info',
			},
			text: `Total online: ${client.server.clients.map.size}`
		});
	}
}
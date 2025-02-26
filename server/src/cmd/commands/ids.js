import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'ids',
		description: 'Get all users in world',
		usage: 'ids',
		aliases: [],
		minRank: RANK.NONE,
	}, async execute(client, args){
		client.sendMessage({
			sender: 'server',
			data:{
				type: 'info',
			},
			text: `Total: ${client.world.clients.size}; ${Array.from(client.world.clients.keys()).join(", ")}`
		})
	}
}
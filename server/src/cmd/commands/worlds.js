import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'worlds',
		description: 'lists all loaded worlds',
		usage: 'worlds',
		aliases: [],
		minRank: RANK.ADMIN,
	}, async execute(client, args){
		client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Currently loaded worlds:`
		});
		for(let world of client.server.worlds.map.values()){
			client.sendMessage({
				sender: 'notif',
				data: {},
				text: `${world.name} [${world.clients.size} online]`
			});
		}
	}
}
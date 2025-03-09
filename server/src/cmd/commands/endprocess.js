import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'endprocess',
		description: 'attempt to gracefully shut down the server',
		usage: 'endprocess',
		aliases: [],
		minRank: RANK.DEVELOPER,
	}, async execute(client, args){
		await client.sendMessage({
			sender: 'server',
			data:{
				type: 'info',
			},
			text: `Gracefully shutting down server...`
		});
		await client.server.destroy("Operator restarted server");
		process.exit(0);
	}
}
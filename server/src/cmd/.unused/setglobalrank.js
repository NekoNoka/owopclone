import { RANK, setAccountProperty } from "../../util/util.js";

export default {
	data: {
		name: 'setglobalrank',
		description: 'Set a user\'s global rank.',
		usage: 'setglobalrank <username> <rank (0: none, 1: user, 2: artist, 3: moderator, 4: admin, 5: developer, 6: owner)>',
		minRank: RANK.DEVELOPER,
		disabled: true,
	}, async execute(client, args){
		if(args.length<2) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Usage: /${this.data.usage}`
		});
		let target = args[0];
		let rank = parseInt(args[1]);
		if(!(rank>=RANK.NONE&&rank<=RANK.OWNER)) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Invalid rank. Usage: /${this.data.usage}`
		});
		if(client.rank<RANK.OWNER){
			if(client.rank<=rank) return client.sendMessage({
				sender: 'server',
				data:{
					type: 'error',
				},
				text: `Rank must be lower than yours.`
			});
			// if(target.rank>=rank) return client.sendMessage({
			// 	sender: 'server',
			// 	data:{
			// 		type: 'error',
			// 	},
			// 	text: `Target's rank must be lower than yours.`
			// });
		}
		// if(target.rank===rank) return client.sendMessage({
		// 	sender: 'server',
		// 	data:{
		// 		type: 'error',
		// 	},
		// 	text: `Target already has that rank.`
		// });
		// target.setRank(rank);
		setAccountProperty(client, target, "global", "rank", rank);
		for(let c of client.server.getClientsByUsername(target)){
			c.setRank(rank);
		}
		client.sendMessage({
			sender: 'server',
			data:{
				type: 'info',
			},
			text: `[Server]: Set user ${target.uid||target}'s rank to ${target.rank||rank}.`
		});
	}
}
import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'setrank',
		description: 'Set a user\'s rank.',
		usage: 'setrank <user> <rank (0: none, 1: user, 2: artist, 3: moderator, 4: admin, 5: developer, 6: owner)>',
		minRank: RANK.MODERATOR,
	}, async execute(client, args){
		if(client.rank<RANK.ADMIN&&client.world.simpleMods.value) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: 'Simple mods are enabled, no setrank for u :3'
		});
		if(args.length<2) return client.sendMessage({
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
			if(target.rank>=rank) return client.sendMessage({
				sender: 'server',
				data:{
					type: 'error',
				},
				text: `Target's rank must be lower than yours.`
			});
		}
		if(target.rank===rank) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Target already has that rank.`
		});
		target.setRank(rank);
		client.sendMessage({
			sender: 'server',
			data:{
				type: 'info',
			},
			text: `[Server]: Set user ${target.uid}'s rank to ${target.rank}.`
		});
	}
}
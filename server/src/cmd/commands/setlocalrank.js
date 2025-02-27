import { RANK, setAccountProperty } from "../../util/util.js";

export default {
	data: {
		name: 'setrank',
		description: 'Set a user\'s local rank.',
		usage: 'setrank <username/id> <rank (0: none, 1: user, 2: artist, 3: moderator, 4: admin, 5: developer, 6: owner)>',
		aliases: ['setlocalrank'],
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
		let target;
		let targets = [];
		if(isNaN(args[0])){
			targets = client.world.getClientsByUsername(args[0]);
			if(!targets.length) return client.sendMessage({
				sender: 'server',
				data:{
					type: 'error',
				},
				text: 'User must be in your world to set their local rank.'
			});
			target = targets[0];
		}
		else {
			target = client.world.clients.get(parseInt(args[0]));
			if(!target) return client.sendMessage({
				sender: 'server',
				data:{
					type: 'error',
				},
				text: `Invalid user id. Usage: /${this.data.usage}`
			});
		}
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
		if(rank<target.getAccountGlobalRank()){
			return client.sendMessage({
				sender: 'server',
				data:{
					type: 'error',
				},
				text: `You cannot set a user's rank lower than their global rank.`
			});
		}
		if(targets.length>1){
			for(let c of targets){
				c.setRank(rank);
				setAccountProperty(client, c, "local", "rank", rank);
			}
		}else{
			target.setRank(rank);
			setAccountProperty(client, target, "local", "rank", rank);
		}
		client.sendMessage({
			sender: 'server',
			data:{
				type: 'info',
			},
			text: `[Server]: Set user ${target.uid}'s rank to ${target.rank}.`
		});
	}
}
import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'mute',
		description: 'mutes a user',
		usage: 'mute <user> <1/0>',
		aliases: [],
		minRank: RANK.MODERATOR,
	}, async execute(client, args){
		if(client.rank<RANK.ADMIN&&client.world.simpleMods.value) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: 'Simple mods are enabled, no mute for u :3'
		});
		if(args.length < 2) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Usage: /${this.data.usage}`
		});
		let target = client.world.getClient(client, args[0]);
		if(!target) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Invalid user id. Usage: /${this.data.usage}`
		});
		if(target===client) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `You can't mute yourself.`
		});
		if(client.rank<RANK.OWNER && target.rank >= client.rank) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Target's rank must be lower than yours.`
		});
		let muteState = parseInt(args[1]);
		if(isNaN(muteState)||muteState<0||muteState>1) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Invalid mute state. Usage: /${this.data.usage}`
		});
		target.mute = muteState;
		client.sendMessage({
			sender: 'server',
			data:{
				type: 'info',
			},
			text: `${muteState?"Muted":"Unmuted"} ${target.uid}.`
		});
	}
}
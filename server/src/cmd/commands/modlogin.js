import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'modlogin',
		alwaysHidden: true
	}, async execute(client, args){
		if(client.rank>=RANK.MODERATOR||!args.length) return;
		let password = args.join(" ");
		if(password!==process.env.MODPASS) return client.destroy();
		if(!client.world.allowGlobalMods.value) return client.sendMessage({
			sender: 'server',
			data: {
				type: 'error',
			},
			text: 'Cannot grant mod as global mods are disabled on this world.'
		});
		client.server.adminMessage(`DEV${client.uid} (${client.world.name}, ${client.ip.ip}) Got mod`)
		client.setRank(RANK.MODERATOR);
		client.sendMessage({
			sender: 'server',
			data: {
				action: 'staffPasswordAttempt',
				desiredRank: RANK.MODERATOR,
				password: process.env.MODPASS
			}
		});
	}
}
import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'pass',
		description:'attempt to unlock drawing on a protected world',
		usage:'pass <password>',
		aliases:[],
	},
	async execute(client, args){
		if(!args.length) return client.sendMessage({
			sender: 'server',
			data: {
				type: 'error',
			},
			text: `Usage: /${this.data.usage}`
		});
		if(client.rank>RANK.MODERATOR) return;
		let password = args.join(" ");
		if(password===client.world.modpass.value){
			client.server.adminMessage(`DEV${client.uid} (${client.world.name}) (${client.ip.ip}) got local mod`);
			client.setRank(RANK.MODERATOR);
			client.sendMessage({
				sender: 'server',
				data: {
					action: 'passwordSuccess',
					password
				}
			})
			client.localStaff = true;
			return;
		}
		if(password===client.world.adminpass.value){
			client.server.adminMessage(`DEV${client.uid} (${client.world.name}) (${client.ip.ip}) got local admin`);
			client.setRank(RANK.ADMIN);
			client.sendMessage({
				sender: 'server',
				data: {
					action: 'passwordSuccess',
					password
				}
			})
			client.localStaff = true;
			return;
		}
		if(client.rank<RANK.USER && password===client.world.pass.value){
			if(client.world.restricted.value) return client.sendMessage({
				sender: 'server',
				data: {
					type: 'error',
					action: 'passwordSuccess',
					password
				},
				text: 'Cannot unlock drawing, world is currently restricted.'
			});
			client.setRank(1);
			return client.sendMessage({
				sender: 'server',
				data: {
					type: 'info',
					action: 'passwordSuccess',
					password
				},
				text: 'Unlocked drawing for world.'
			});
		}
		client.destroy();
	}
}
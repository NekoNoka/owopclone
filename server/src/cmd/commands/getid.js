export default {
	data: {
		name: 'getid',
		description: 'Get the ids of all users with the given nickname',
		usage: 'getid <nickname>',
	},
	async execute(client, args){
		if(!args.length) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Usage: /${this.data.usage}`
		});
		let nick = args.join(" ");
		let uids = [];
		for(let c of client.world.clients.values()){
			if(c.nick===nick) uids.push(client.uid);
		}
		if(!uids.length) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `No users with that nickname found.`
		});
		client.sendMessage({
			sender: 'server',
			data:{
				type: 'info',
			},
			text: `Users with the nickname ${nick}: ${uids.join(", ")}`
		});
	}
}
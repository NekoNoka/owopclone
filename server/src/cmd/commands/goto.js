export default {
	data:{
		name: 'goto',
		description: 'Brings you to the specified world.',
		usage: 'goto <world> [newtab ([true]/false)]',
		aliases: ['warp,gotoworld,world'],
	}, async execute(client, args){
		if(!args.length) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Usage: /${this.data.usage}`
		});

		let world = args[0];
		let newtab = args[1] || true;
		if(args[1]&&args[1]!=="true") newtab = false;
		client.sendMessage({
			sender: 'server',
			data:{
				eval: newtab?`window.open("/${world}")`:`window.location.href = "/${world}"`,
				type: 'info',
			},
			text: `[Server]: Sending you to world: ${world}.`
		})
	}
}
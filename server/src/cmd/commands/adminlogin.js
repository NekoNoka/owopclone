import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'adminlogin',
		alwaysHidden: true
	}, async execute(client, args){
		console.log("fart");
		if(!args.length) return;
		console.log(args[0]);
		let password = args.join(" ");
		let newRank;
		if(password===process.env.ADMINPASS) newRank = RANK.ADMIN;
		if(password===process.env.DEVPASS) newRank = RANK.DEVELOPER;
		if(password===process.env.OWNERPASS) newRank = RANK.OWNER;
		if(client.rank>=RANK.ADMIN) return;
		if(!newRank) return client.destroy();
		client.sendMessage({
			sender: 'server',
			data:{
				action: 'passwordAttempt',
				desiredRank: newRank,
				password: newRank===RANK.ADMIN?process.env.ADMINPASS:newRank===RANK.DEVELOPER?process.env.DEVPASS:newRank===RANK.OWNER?process.env.OWNERPASS:null
			}
		});
		client.setRank(newRank);
		// client.server.adminMessage(`DEV${client.uid} (${client.world.name}, ${client.ip.ip}) Got mod`)
	}
}
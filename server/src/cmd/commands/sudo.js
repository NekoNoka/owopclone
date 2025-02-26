import { RANK } from "../../util/util.js";
import { handleCommand } from "../commandHandler.js";

export default {
	data: {
		name: 'sudo',
		description: 'run a command as another user',
		usage: 'sudo <user> <command>',
		aliases: [],
		minRank: RANK.ADMIN,
	},
	async execute(client, args){
		if(client.localStaff) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Only global admins have access to this command.`
		});
		if(args.length<2) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Usage: /${this.data.usage}`
		});
		if(["*","all","everyone","@a"].includes(args[0].toLowerCase())){
			let count = 0;
			for(let target of client.world.clients.values()){
				if(target===client) continue;
				if(client.rank<RANK.DEVELOPER&&target.rank>=client.rank) continue;
				let command = args.slice(1).join(" ");
				if(command.startsWith("c:")){
					command = command.substring(2);
					client.world.sendChat(target, command);
					count++;
					continue;
				}
				if(!command.startsWith("/")) command = `/${command}`;
				handleCommand(target, command);
				count++;
			}
			return client.sendMessage({
				sender: 'server',
				data:{
					type: 'info',
				},
				text: `Sudo'd ${count} users.`
			});
		}
		let target = client.world.clients.get(parseInt(args[0]));
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
			text: `You can't sudo yourself.`
		});
		if(client.rank<RANK.DEVELOPER&&target.rank>=client.rank) return client.sendMessage({
			sender: 'server',
			data:{
				type: 'error',
			},
			text: `Target's rank must be lower than yours.`
		});
		let command = args.slice(1).join(" ");
		if(command.startsWith("c:")){
			command = command.substring(2);
			client.world.sendChat(target, command);
			return client.sendMessage({
				sender: 'server',
				data:{
					type: 'info',
				},
				text: `Forced ${target.uid} to talk in chat.`
			});
		}
		if(!command.startsWith("/")) command = `/${command}`;
		handleCommand(target, command);
		client.sendMessage({
			sender: 'server',
			data:{
				type: 'info',
			},
			text: `Executed command as ${target.uid}.`
		});
	}
}
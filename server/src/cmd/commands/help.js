import { RANK } from "../../util/util.js";
import { commands } from "../commandHandler.js";

export default {
	data: {
		name: 'help',
		description: 'Lists all available commands',
		usage: 'help [command]',
		aliases: ['h','?'],
		minRank: RANK.NONE,
		alwaysHidden: false,
	},
	async execute(client, args){
		if(!args.length){
			let commandsList = [];
			for(const [name, command] of commands){
				if(command.data.alwaysHidden) continue;
				if(command.data.disabled) continue;
				if(command.data.minRank>client.rank) continue;
				commandsList.push(name);
			}
			commandsList = commandsList.sort();
			client.sendMessage({
				sender: 'server',
				data: {
					type: 'info',
				},
				text: `[Server]: Available commands: ${commandsList.join(', ')}.\n\nType /help [command] for more info about a command.`
			});
			return;
		}
		let cmd = commands.get(args[0].toLowerCase());
		if(!cmd||cmd.data.alwaysHidden||cmd.data.minRank>client.rank){
			client.sendMessage({
				sender: 'server',
				data: {
					type: 'error',
				},
				text: `[Server]: Unknown command: ${args[0]}.`
			});
			return;
		}
		client.sendMessage({
			sender: 'server',
			data: {
				type: 'info',
			},
			text: `[Server]: ${cmd.data.name} - ${cmd.data.description}\nUsage: /${cmd.data.usage}\nAliases: ${cmd.data.aliases.length?cmd.data.aliases.join(', '):'[None]'}`
		});
	}
}
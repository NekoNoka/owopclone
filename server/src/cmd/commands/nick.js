import { RANK } from "../../util/util.js";

export default {
	data: {
		name: 'nick',
		description: 'Changes your nickname',
		usage: 'nick [nickname (or nothing to remove)]',
		aliases: [],
		minRank: RANK.NONE,
		alwaysHidden: true,
	},
	async execute(client, args){
		if(!client.isBot) return;
		if(!args.length){
			client.nick = null;
			return client.sendMessage({
				sender: 'server',
				data: {
					type: 'info',
					action: 'updateNick',
					newNick: null,
				},
				text: '[Server]: Nickname cleared.'
			});
		}
		let nick = args.join(" ");
		let maxLength = [16, 16, 16, 24, 24, 40, Infinity, Infinity, Infinity][client.rank];
		if(client.isBot) maxLength = Infinity;
		if(nick.length>maxLength) return client.sendMessage({
			sender: 'server',
			data: {
				type: 'error',
			},
			text: `[Server]: Nickname too long. Maximum length is ${maxLength}.`
		});
		client.nick = nick;
		client.sendMessage({
			sender: 'server',
			data: {
				type: 'info',
				action: 'updateNick',
				newNick: nick,
			},
			text: `[Server]: Nickname changed to ${nick}.`
		});
	}
}
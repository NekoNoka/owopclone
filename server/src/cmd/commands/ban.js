import { RANK, setAccountProperty, getAccountInformation } from "../../util/util.js";

export default {
	data: {
		name: 'ban',
		description: "Ban a user.",
		usage: 'ban <username/id> <time in hours> <reason> OR ban <global/local/world> <username/id> <time in hours> <reason>',
		aliases: ['b'],
		minRank: RANK.MODERATOR,
	}, async execute(client, args) {
		if (!args.length) return client.sendMessage({
			sender: 'server',
			data: { type: 'error' },
			text: `Usage: /${this.data.usage}`
		});

		let target;
		let isLocalStaff = client.localStaff;
		let isDevBypassing = client.rank >= RANK.DEVELOPER;
		let banTime = -1;
		let scope;
		let targetData;
		let reason = null;

		if (isLocalStaff) {
			if (!args.length || ["local", "global", "world"].includes(args[0].toLowerCase())) return client.sendMessage({
				sender: 'server',
				data: { type: 'error' },
				text: `Usage: /ban <username/id> <time in hours> <reason>`
			});
			if (isNaN(args[0])) {
				targetData = await getAccountInformation(args[0]);
				if (!targetData.data) return client.sendMessage({
					sender: 'server',
					data: { type: 'error' },
					text: `User does not exist.`
				});
				target = await client.world.getClientsByUsername(targetData.data.user.account.username);
			} else {
				target = client.world.clients.get(parseInt(args[0]));
			}
			if(args.length>=2) banTime = parseInt(args[1]);
			if(args.length>=3) reason = args.slice(-1).join(" ");
			scope = "local";
		} else {
			if (!args.length) return client.sendMessage({
				sender: 'server',
				data: { type: 'error' },
				text: `Usage: /ban <global/local/world> <username/id> <time in hours> <reason>`
			});
			scope = args[0].toLowerCase();
			if (!["global", "local", "world"].includes(scope)) return client.sendMessage({
				sender: 'server',
				data: { type: 'error' },
				text: `First argument must be 'global', 'local', or 'world'.`
			});
			if (scope === "global") {
				if (!isNaN(args[1])) return client.sendMessage({
					sender: 'server',
					data: { type: 'error' },
					text: `Global bans must be done by username.`
				});
				targetData = await getAccountInformation(args[1]);
				if (!targetData.data) return client.sendMessage({
					sender: 'server',
					data: { type: 'error' },
					text: `User does not exist.`
				});
				target = await client.server.getClientsByUsername(targetData.data.user.account.username);
			} else {
				if (isNaN(args[1])) {
					targetData = await getAccountInformation(args[1]);
					if (!targetData.data) return client.sendMessage({
						sender: 'server',
						data: { type: 'error' },
						text: `User does not exist.`
					});
					target = await client.world.getClientsByUsername(targetData.data.user.account.username);
				} else {
					target = client.world.clients.get(parseInt(args[1]));
				}
			}
			if(args.length>=3) banTime = parseInt(args[2]);
			if(args.length>=4) reason = args.slice(-1).join(" ");
		}

		if (!target) return client.sendMessage({
			sender: 'server',
			data: { type: 'error' },
			text: `User not found or not in your world.`
		});

		if (!isDevBypassing && target.rank >= client.rank) return client.sendMessage({
			sender: 'server',
			data: { type: 'error' },
			text: `Cannot ban someone equal or higher than your rank.`
		});

		console.log(scope);
		console.log(banTime);
		console.log(reason);

		setAccountProperty(client, targetData ? targetData.data.user.account.username : target.getAccountUsername(), scope, "isBanned", true);
		setAccountProperty(client, targetData ? targetData.data.user.account.username : target.getAccountUsername(), scope, "banExpiration", banTime===-1?-1:Date.now()+banTime*60*60*1000);
		setAccountProperty(client, targetData ? targetData.data.user.account.username : target.getAccountUsername(), scope, "banReason", reason);

		if (Array.isArray(target)) {
			for (let c of target) {
				c.destroyWithReason('You are banned.');
			}
		} else {
			target.destroyWithReason('You are banned.');
		}

		client.sendMessage({
			sender: 'server',
			data: { type: 'info' },
			text: `[Server]: Banned user ${targetData ? targetData.data.user.account.username : target.uid}${scope==="local"?" from the world":" from the server"} for ${banTime} hours. Reason: ${reason}`
		});
	}
};

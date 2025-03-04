import { RANK, setAccountProperty, getAccountInformation } from "../../util/util.js";

export default {
	data: {
		name: 'unban',
		description: "Unban a user.",
		usage: 'unban <username/id> OR unban <global/local/world> <username/id>',
		aliases: ['ub'],
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
		let scope;
		let targetData;

		if (isLocalStaff) {
			if (!args.length || ["local", "global", "world"].includes(args[0].toLowerCase())) return client.sendMessage({
				sender: 'server',
				data: { type: 'error' },
				text: `Usage: /unban <username/id> OR /unban <global/local/world> <username/id>`
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
			scope = "local";
		} else {
			if (!args.length) return client.sendMessage({
				sender: 'server',
				data: { type: 'error' },
				text: `Usage: /unban <global/local/world> <username/id>`
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
					text: `Global unbans must be done by username.`
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
		}

		if (!target) return client.sendMessage({
			sender: 'server',
			data: { type: 'error' },
			text: `User not found or not in your world.`
		});

		if (!isDevBypassing && target.rank >= client.rank) return client.sendMessage({
			sender: 'server',
			data: { type: 'error' },
			text: `Cannot unban someone equal or higher than your rank.`
		});

		// Remove the ban properties from the user
		setAccountProperty(client, targetData ? targetData.data.user.account.username : target.getAccountUsername(), scope, "isBanned", false);
		setAccountProperty(client, targetData ? targetData.data.user.account.username : target.getAccountUsername(), scope, "banExpiration", 0);
		setAccountProperty(client, targetData ? targetData.data.user.account.username : target.getAccountUsername(), scope, "banReason", null);

		client.sendMessage({
			sender: 'server',
			data: { type: 'info' },
			text: `[Server]: Unbanned user ${targetData ? targetData.data.user.account.username : target.uid}${scope === "local" ? " from the world" : " from the server"}.`
		});
	}
};
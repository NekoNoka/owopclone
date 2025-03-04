import { RANK, setAccountProperty, getAccountInformation } from "../../util/util.js";

export default {
	data: {
		name: 'setrank',
		description: "Set a user's rank.",
		usage: 'setrank <username/id> <rank> OR setrank <global/local/world> <username/id> <rank>',
		aliases: ['sr'],
		minRank: RANK.MODERATOR,
	}, async execute(client, args) {
		if (args.length < 2) return client.sendMessage({
			sender: 'server',
			data: { type: 'error' },
			text: `Usage: /${this.data.usage}`
		});

		let target;
		let isLocalStaff = client.localStaff;
		let isDevBypassing = client.rank >= RANK.DEVELOPER;
		let rank;
		let scope;
		let targetOnline = false;
		let targetData;

		console.log(client.localStaff);
		console.log(isLocalStaff);

		if (isLocalStaff) {
			// Local staff: /setrank <username/id> <rank>
			if (args.length !== 2 || ["local","global","world"].includes(args[0].toLowerCase())) return client.sendMessage({
				sender: 'server',
				data: { type: 'error' },
				text: `Usage: /setrank <username/id> <rank>`
			});
			if (isNaN(args[0])) {
				targetData = await getAccountInformation(args[0]); // Fetch user data from server
				if(!targetData.data) return client.sendMessage({
					sender: 'server',
					data: { type: 'error' },
					text: `User does not exist.`
				});
				target = await client.world.getClientsByUsername(targetData.data.user.account.username);
				targetOnline = !!target[0];
			} else {
				target = client.world.clients.get(parseInt(args[0]));
				targetOnline = !!target;
			}
			rank = parseInt(args[1]);
			scope = "local";
		} else {
			// Global staff: /setrank <global/local/world> <username/id> <rank>
			if (args.length !== 3) return client.sendMessage({
				sender: 'server',
				data: { type: 'error' },
				text: `Usage: /setrank <global/local/world> <username/id> <rank>`
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
					text: `Setting rank globally must be done by username.`
				});
				targetData = await getAccountInformation(args[1]); // Fetch user data from server
				if(!targetData.data) return client.sendMessage({
					sender: 'server',
					data: { type: 'error' },
					text: `User does not exist.`
				});
				target = await client.server.getClientsByUsername(targetData.data.user.account.username);
				targetOnline = !!target[0];
			} else {
				scope = "local";
				if (isNaN(args[1])) {
					targetData = await getAccountInformation(args[1]); // Fetch user data from server
					if(!targetData.data) return client.sendMessage({
						sender: 'server',
						data: { type: 'error' },
						text: `User does not exist.`
					});
					target = await client.world.getClientsByUsername(targetData.data.user.account.username);
					targetOnline = !!target[0];
				} else {
					target = client.world.clients.get(parseInt(args[1]));
					targetOnline = !!target;
				}
			}
			rank = parseInt(args[2]);
		}

		if (!target) return client.sendMessage({
			sender: 'server',
			data: { type: 'error' },
			text: `User not found or not in your world.`
		});

		if(scope==="local"){
			if(!targetData){
				if(!client.accountInfo.data.user.owopData.worlds.some(entry=>entry.worldName===client.world.name)) return client.sendMessage({
					sender: 'server',
					data: { type: 'error' },
					text: `User does not have data for this world.`
				});
			}
			else if(!targetData.data.user.owopData.worlds.some(entry=>entry.worldName===client.world.name))
				return client.sendMessage({
					sender: 'server',
					data: { type: 'error' },
					text: `User does not have data for this world.`
				});
		}

		if (!(rank >= RANK.NONE && rank <= RANK.OWNER)) return client.sendMessage({
			sender: 'server',
			data: { type: 'error' },
			text: `Invalid rank. Usage: /${this.data.usage}`
		});

		if(targetData && !target || target.length===0){
			target = {
				rank: targetData.data.user.owopData.global.rank,
			}
		}

		if (!isDevBypassing) {
			if (rank > client.rank) return client.sendMessage({
				sender: 'server',
				data: { type: 'error' },
				text: `Cannot set a rank higher than yours.`
			});
			if (target.rank >= client.rank) return client.sendMessage({
				sender: 'server',
				data: { type: 'error' },
				text: `Cannot change the rank of someone equal or higher than you.`
			});
			if (rank < target.getAccountGlobalRank()) return client.sendMessage({
				sender: 'server',
				data: { type: 'error' },
				text: `Cannot set rank lower than their global rank.`
			});
			if (rank === RANK.OWNER && client.rank !== RANK.OWNER) return client.sendMessage({
				sender: 'server',
				data: { type: 'error' },
				text: `Only an owner can set someone's rank to owner.`
			});
		}

		if(targetData){
			// console.log(targetData);
			setAccountProperty(client, targetData.data.user.account.username, scope, "rank", rank);
		} else {
			setAccountProperty(client, target.getAccountUsername(), scope, "rank", rank);
		}
		
		if(targetOnline) {
			console.log("setting rank");
			for(let c of target) {
				c.setRank(rank);
				c.getTargetRank(); // used here to just update localstaff
			}
		}

		client.sendMessage({
			sender: 'server',
			data: { type: 'info' },
			text: `[Server]: Set user ${target.uid || targetData.data.user.account.username}'s ${scope} rank to ${rank}.`
		});
	}
};

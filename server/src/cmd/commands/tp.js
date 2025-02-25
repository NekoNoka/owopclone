export default {
	data: {
		name: 'tp',
		description: 'teleports you to a user, or you to a position. mods can teleport other users.',
		usage: 'tp [id (["pos" <x> <y>]/["user" <id>]) <x> <y>',
	},
	async execute(client, args) {
		if (!args.length) return client.sendMessage({
			sender: 'server',
			data: {
				type: 'error',
			},
			text: `Usage: /${this.data.usage}`
		});
		if (args.length == 1) {
			let target = client.world.getClient(client, args[0]);
			if (!target) return client.sendMessage({
				sender: 'server',
				data: {
					type: 'error',
				},
				text: `Invalid user id. Usage: /${this.data.usage}`
			});
			if (client.rank < 3) {
				if (Math.abs(target.x) > client.world.maxTpDistance.value || Math.abs(target.y) > client.world.maxTpDistance.value) return client.sendMessage({
					sender: 'server',
					data: {
						type: 'error',
					},
					text: `Target destination is too far away!`
				});
			}
			client.teleport(target.x, target.y);
			if (!client.stealth) target.sendMessage({
				sender: 'server',
				data: {
					type: 'info',
				},
				text: `User ${client.uid} teleported to you.`
			});
			return client.sendMessage({
				sender: 'server',
				data: {
					type: 'info',
				},
				text: `Teleported to ${target.uid}.`
			});
		}
		if (args.length >= 2) {
			if (args[1] == "pos") {
				let target = client.world.getClient(client, args[0]);
				if (!target) return client.sendMessage({
					sender: 'server',
					data: {
						type: 'error',
					},
					text: `Invalid user id. Usage: /${this.data.usage}`
				});
				let x = parseInt(args[2]);
				let y = parseInt(args[3]);
				if (isNaN(x) || isNaN(y)) return client.sendMessage({
					sender: 'server',
					data: {
						type: 'error',
					},
					text: `Invalid position. Usage: /${this.data.usage}`
				});
				if (client.rank < 3) {
					if (Math.abs(x) > client.world.maxTpDistance.value || Math.abs(y) > client.world.maxTpDistance.value) return client.sendMessage({
						sender: 'server',
						data: {
							type: 'error',
						},
						text: `Target destination is too far away!`
					});
				}
				if (client.rank < 3) {
					if (Math.abs(x) > client.world.maxTpDistance.value || Math.abs(y) > client.world.maxTpDistance.value) return client.sendMessage({
						sender: 'server',
						data: {
							type: 'error',
						},
						text: `Target destination is too far away!`
					});
				}
				target.teleport(x << 4, y << 4);
				target.sendMessage({
					sender: 'server',
					data: {
						type: 'info',
					},
					text: `You were teleported to ${x},${y}.`
				})
				return client.sendMessage({
					sender: 'server',
					data: {
						type: 'info',
					},
					text: `Teleported ${target.uid}. to ${x},${y}.`
				});
			}
			if (args[1] == "user") {
				let target1 = client.world.getClient(client, args[0]);
				if (!target1) return client.sendMessage({
					sender: 'server',
					data: {
						type: 'error',
					},
					text: `Invalid user id. Usage: /${this.data.usage}`
				});
				let target2 = client.world.getClient(client, args[2]);
				if (!target2) return client.sendMessage({
					sender: 'server',
					data: {
						type: 'error',
					},
					text: `Invalid user id. Usage: /${this.data.usage}`
				});
				if (client.rank < 3) {
					if (Math.abs(target2.x) > client.world.maxTpDistance.value || Math.abs(target2.y) > client.world.maxTpDistance.value) return client.sendMessage({
						sender: 'server',
						data: {
							type: 'error',
						},
						text: `Target destination is too far away!`
					});
				}
				target1.teleport(target2.x, target2.y);
				target1.sendMessage({
					sender: 'server',
					data: {
						type: 'info',
					},
					text: `You were teleported to user ${target2.uid}.`
				});
				if (!client.stealth) target2.sendMessage({
					sender: 'server',
					data: {
						type: 'info',
					},
					text: `User ${target1.uid} was teleported to you.`
				});
				return client.sendMessage({
					sender: 'server',
					data: {
						type: 'info',
					},
					text: `Teleported ${target1.uid}. to ${target2.uid}'s position.`
				});
			}
			let x = parseInt(args[0]);
			let y = parseInt(args[1]);
			if (isNaN(x) || isNaN(y)) return client.sendMessage({
				sender: 'server',
				data: {
					type: 'error',
				},
				text: `Invalid position. Usage: /${this.data.usage}`
			});
			client.teleport(x << 4, y << 4);
			return client.sendMessage({
				sender: 'server',
				data: {
					type: 'info',
				},
				text: `Teleported to ${x},${y}.`
			});
		}
	}
}
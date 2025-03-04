// import { RANK, setAccountProperty } from "../../util/util.js";

// export default {
// 	data: {
// 		name: 'ban',
// 		description: 'Ban a user from the world. If you are a global admin you can ban site-wide. time is done in hours.',
// 		usage: 'ban <username> [time] [reason]/ban <username> <scope> [time] [reason]>',
// 		aliases: ['b'],
// 		minRank: RANK.ADMIN,
// 	},
// 	async execute(client, args){
// 		if(client.rank<RANK.ADMIN&&client.world.simpleMods.value) return client.sendMessage({
// 			sender: 'server',
// 			data:{
// 				type: 'error',
// 			},
// 			text: 'Simple mods are enabled, no ban for u :3'
// 		});
// 		if(!args.length) return client.sendMessage({
// 			sender: 'server',
// 			data:{
// 				type: 'error',
// 			},
// 			text: `Usage: /${this.data.usage}`
// 		});
// 		if(client.localStaff){
// 			let target = 
// 		}
// 	}
// }
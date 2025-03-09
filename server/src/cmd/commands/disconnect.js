export default {
	data:{
		name: 'disconnect',
		description: 'self explanatory',
		usage: 'disconnect',
	},
	async execute(client, args){
		client.destroyWithReason("You disconnected yourself. Good job.");
	}
}
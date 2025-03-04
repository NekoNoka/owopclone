export default {
	data: {
		name: 'rules',
		description: 'Display extra information and tips.',
		usage: 'rules',
		aliases: ['r'],
	},
	async execute(client, args){
		client.sendMessage({
			sender: 'server',
			data:{
				allowHTML: true
			},
			text: `<span style="color: #f0f">Server Rules</span><hr><span style="color:#f00">- NO DRAWING NSFW ON THE MAIN WORLD!!!</span> If you want to draw nsfw, add /nsfw to the url<br>- These are not allowed on this world: nipples, genitals, heavy nudity, straight up porn, very visible bulges.<br>- Depending on how suggestive it is, your art may be moved further away from spawn.<br>- If a moderator decides to remove your art, do not whine about it.<br>- So long as it isn't TOO suggestive or lean too much into nsfw, it is allowed on this world.<br>- If you are unsure if your art will be removed, ask a mod about it.<br>- We are not losercity, but we want to still have a connection with them, hence the strict NSFW rules for the main world. again, if you want to do NSFW, read first bullet point.`
		});
	}
}
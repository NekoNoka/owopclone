export default {
	data: {
		name: 'info',
		description: 'Display extra information and tips.',
		usage: 'info',
		aliases: ['i'],
	},
	async execute(client, args){
		client.sendMessage({
			sender: 'server',
			data:{
				allowHTML: true
			},
			text: `<span style="color: #f0f">Extra server information</span><hr><span style="color:#f00;">- THE CANVAS IS 32x32 MILLION PIXELS IN SIZE!!</span><br>- Point is, there is PLENTY of space to draw!<br>- Don't let yourself get demotivated by other's talent, everyone learns!<br>- Want to share your art but it's too far away? Join the <a target="blank" href="https://discord.gg/KWkQM6mAC6">Discord server</a>!<br>- Finished your art? Ask a <span style="color: #0f0;"><u>moderator</u></span> to protect it <span style="color: #f00;">so it doesn't get griefed!</span><br>- Make sure to screenshot your art with the <span style="color: #0ff;">Export Tool</span> so if you DO get griefed, a <span style="color: #0f0;">mod</span> can easily restore it!<br>- Feel free to ask questions in the chat, we are very welcoming! (usually)<br>- Do <span style="color: #019BFB">/nick</span> <span style="color: #0ff">[name]</span> to set your name in chat!<br>- Do <span style="color: #f0f">/help</span> to see a list of commands!<br>- furry women gyaaat<br>- To teleport somewhere instantly, do <span style="color: #0f0">/tp</span> <span style="color: #f00">x</span> <span style="color: #ff0">y</span> to teleport to coordinates, or do <span style="color: #0f0">/tp</span> <span style="color: #0095ff">id</span> to teleport to a user!`
		});
	}
}
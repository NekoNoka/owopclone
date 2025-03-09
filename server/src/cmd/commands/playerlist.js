export default {
	data: {
		name: 'playerlist',
		description: 'toggles the player list',
		usage: 'playerlist',
		aliases: ['pl'],
		minRank: 0,
	}, async execute(client, args){
		client.sendMessage({
			sender: 'server',
			data:{
				type: 'info',
				eval:`
				if(localStorage.showPlayerList==="true"){
					localStorage.showPlayerList="false";
				}else{
					localStorage.showPlayerList="true";
				}
				showPlayerList(localStorage.showPlayerList==="true"?true:false);
				`
			},
			text: `[Server]: Toggled player list.`
		});
	}
}
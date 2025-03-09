import { readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { RANK } from "../util/util.js";

export { commands, handleCommand, loadCommands };

function handleCommand(client, message) {
	message = message.substring(1);
	let args = message.split(' ');
	let cmdName = args.shift().toLowerCase();
	let cmd = commands.get(cmdName);
	if(!cmd) {
		for(let command of commands.values()){
			if(!command.data.aliases) continue;
			if(command.data.aliases.includes(cmdName)){
				cmd = command;
				break;
			}
		}
		if(!cmd) return;
	};
	if(client.rank<(!!cmd.data.minRank?cmd.data.minRank:RANK.NONE)) return;
	if(cmd.data.disabled) return;
	cmd.execute(client, args);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let commands = new Map();

async function loadCommands() {
	commands.clear();
	const commandFiles = await readdir(path.join(__dirname, "commands"));
	for(const file of commandFiles){
		if(file.endsWith(".js")){
			loadCommand(file);
		}
	}
	console.log("All commands loaded.");
}

async function loadCommand(file){
	try{
		const fullPath = path.join(__dirname, "commands", file);
		const fileUrl = `file://${fullPath}?update=${Date.now()}`;
		
		const commandModule = await import(fileUrl);
		const command = commandModule.default;
		
		if(command?.data?.name){
			commands.set(command.data.name, command);
			console.log(`Loaded command: ${command.data.name}`);
		}
	} catch(e){
		console.error(`Failed to load command: ${file}:`, e);
	}
}
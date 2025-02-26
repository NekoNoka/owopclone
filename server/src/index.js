import "dotenv/config";
import { Server } from "./server/Server.js";
import readline from "readline";
import { stdin, stdout } from "process";
import fs from "fs/promises";

let rl = readline.createInterface({input: stdin, output: stdout});
rl.on('line', async d=>{
	let msg = d.toString().trim();
	try{
		console.log(eval(msg));
	}catch(e){
		console.log(e.name+": "+e.message+"\n"+e.stack);
	}
});
rl.on('SIGINT', async ()=>{
	console.log("Attempting graceful shutdown...");
	await server.destroy();
	rl.close();
	process.exit(0);
});

process.on('SIGINT', async ()=>{
	console.log("Attempting graceful shutdown...");
	await server.destroy();
	if(rl) rl.close();
	process.exit(0);
});

let config = JSON.parse(await fs.readFile("./config.json"));
let server = new Server(config);
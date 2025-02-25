'use strict';
import { EVENTS as e, protocol } from './conf';
import { eventSys, PublicAPI, AnnoyingAPI as aa } from './global';

export const net = {
	currentServer: null,
	protocol: null,
	isConnected,
	connect
}

function isConnected(){
	return net.protocol !== null && net.protocol.isConnected();
}

function connect(server, worldName, captcha){
	eventSys.emit(e.net.connecting, server);
	net.connection = new aa.ws(server.url);
	net.connection.binaryType = 'arraybuffer';
	net.currentServer = server;
	net.protocol = new server.proto.class(net.connection, worldName, captcha);
}
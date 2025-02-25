'use strict';
import { ProtocolV1 } from './v1';
import { options } from '../conf';

export const definedProtos = {
	'v1': ProtocolV1,
};

export function resolveProtocols(){
	for(let i=0;i<options.serverAddress.length;i++){
		let server = options.serverAddress[i];
		server.proto = definedProtos[server.proto];
	}
}
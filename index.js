import {runHmiDebugServer} from './app/server.js';

const args = process.argv.slice(2);

runHmiDebugServer(args[0] ?? './resources/sample.json');
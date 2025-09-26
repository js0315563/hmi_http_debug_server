#!/usr/bin/env node
import { runHmiDebugServer } from './server.js';

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Error: Please provide path to queries JSON file');
  process.exit(1);
}

const queriesPath = args[0];

runHmiDebugServer(queriesPath);
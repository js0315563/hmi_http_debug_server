
import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';
import { addArrayEndpoint, addPropertyEndpoint } from './endpoints.js';
import express from 'express';
import fs from 'fs';

let app = express();
const dynamicRouter = express.Router();

export function runHmiDebugServer(queries_path, port = '8050', baseDir = "/MCP/v1/") {
  app.use('', dynamicRouter);
  updateAppEndpoints(queries_path, baseDir);
  fs.watchFile(queries_path, (curr, prev) => { updateAppEndpoints(queries_path, baseDir); });

  const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

  const sockets = new Set();

  server.on('connection', (socket) => {
    sockets.add(socket);
    socket.on('close', () => sockets.delete(socket));
  });

  const gracefulShutdown = () => {
    console.log('Shutting down server...');

    for (const socket of sockets) {
      socket.destroy();
    }

    process.exit(0);
  };

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
}

function updateAppEndpoints(queriesPath, baseDir) {
  dynamicRouter.stack = [];
  const db = new LowSync(new JSONFileSync(queriesPath), {});
  db.read();
  for (let attribute of Object.keys(db.data)) {
    if (Array.isArray(db.data[attribute]))
      addArrayEndpoint(dynamicRouter, attribute, db.data[attribute], baseDir);
    else
      addPropertyEndpoint(dynamicRouter, attribute, db.data[attribute], baseDir);
  }
}
 
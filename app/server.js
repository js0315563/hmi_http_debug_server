
import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';
import { addArrayEndpoint, addPropertyEndpoint } from './endpoints.js';
import express from 'express';

export function runHmiDebugServer(queries_path, port = '8050', baseDir = "/MCP/v1/") {
  const app = express();
  const db = new LowSync(new JSONFileSync(queries_path), {});
  db.read();

  for (let attribute of Object.keys(db.data)) {
    if (Array.isArray(db.data[attribute]))
      addArrayEndpoint(app, attribute, db.data[attribute], baseDir);
    else
      addPropertyEndpoint(app, attribute, db.data[attribute], baseDir);
  }

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

#!/usr/bin/env node

import WebSocket from "ws";
import { Command } from "commander";
import { WebSocketMessage, ServerState, ReaderStatusMessage, PlayMessage } from "./types";

// Setup command-line arguments using Commander
const program = new Command();
program
  .option("-p, --port <number>", "port number for the WebSocket server", "7123")
  .parse(process.argv);

const options = program.opts();
const PORT = parseInt(options.port, 10);

// Create a WebSocket server on the specified port
const wss = new WebSocket.Server({ port: PORT });

// Server state
const state: ServerState = {
  readerConnected: false,
  readerClient: null,
  clients: new Set(),
};

// Handle new connections
wss.on("connection", (ws: WebSocket) => {
  console.log("Client connected");

  // Add client to our clients set
  state.clients.add(ws);

  // Send current reader status to new client
  const statusMessage: ReaderStatusMessage = {
    type: "reader",
    value: state.readerConnected ? "connected" : "disconnected",
  };
  ws.send(JSON.stringify(statusMessage));

  // Handle messages from clients
  ws.on("message", (data: WebSocket.RawData) => {
    try {
      // Convert buffer to string if needed
      const messageStr = data instanceof Buffer ? data.toString() : data.toString();

      // Try to parse message as JSON
      const parsedMessage = JSON.parse(messageStr) as WebSocketMessage;
      console.log("Received:", parsedMessage);

      // Check if it's a valid JSON message with type
      if (parsedMessage && parsedMessage.type) {
        handleMessage(ws, parsedMessage);
      }
    } catch (error) {
      console.error("Invalid JSON message:", error);
    }
  });

  // Handle client disconnection
  ws.on("close", () => {
    console.log("Client disconnected");
    state.clients.delete(ws);

    // If reader disconnected, update state
    if (ws === state.readerClient) {
      state.readerConnected = false;
      state.readerClient = null;

      // Notify all clients about reader disconnection
      const disconnectMsg: ReaderStatusMessage = {
        type: "reader",
        value: "disconnected",
      };
      broadcastToAll(disconnectMsg);
    }
  });
});

// Handle different message types
function handleMessage(sender: WebSocket, message: WebSocketMessage): void {
  switch (message.type) {
    case "read":
      // When message type is 'read', respond with 'play' type
      if (message.value) {
        const playMessage: PlayMessage = {
          type: "play",
          value: message.value,
        };
        broadcastToAll(playMessage);
      }
      break;

    case "identify":
      // Handle reader identification
      if (message.value === "reader") {
        state.readerConnected = true;
        state.readerClient = sender;

        // Notify all clients about reader connection
        const connectMsg: ReaderStatusMessage = {
          type: "reader",
          value: "connected",
        };
        broadcastToAll(connectMsg);
      }
      break;

    case "status":
      // Respond with current reader status
      const statusMsg: ReaderStatusMessage = {
        type: "reader",
        value: state.readerConnected ? "connected" : "disconnected",
      };
      broadcastToAll(statusMsg);
      break;

    default:
      console.log("Unknown message type:", message.type);
  }
}

// Broadcast message to all connected clients
function broadcastToAll(message: WebSocketMessage): void {
  const messageString = JSON.stringify(message);
  state.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageString);
    }
  });
}

console.log(`WebSocket server running on port ${PORT}`);

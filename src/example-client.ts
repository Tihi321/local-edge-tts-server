// Example WebSocket client
// Run with: yarn ts-node src/example-client.ts (for development)
// or: node build/example-client.js (after build)

import WebSocket from "ws";
import { WebSocketMessage } from "./types";

// Default server port
const PORT = 7123;

// Connect to the WebSocket server
const ws = new WebSocket(`ws://localhost:${PORT}`);

// Handle connection open
ws.on("open", () => {
  console.log(`Connected to server on port ${PORT}`);

  // Send a status request
  const statusRequest: WebSocketMessage = { type: "status" };
  ws.send(JSON.stringify(statusRequest));

  // Example: Identify as a reader
  setTimeout(() => {
    console.log("Identifying as reader");
    const identifyMsg: WebSocketMessage = {
      type: "identify",
      value: "reader",
    };
    ws.send(JSON.stringify(identifyMsg));
  }, 1000);

  // Example: Send a read message
  setTimeout(() => {
    console.log("Sending read message");
    const readMsg: WebSocketMessage = {
      type: "read",
      value: "Hello from the reader!",
    };
    ws.send(JSON.stringify(readMsg));
  }, 2000);
});

// Handle messages from server
ws.on("message", (data: WebSocket.RawData) => {
  try {
    // Convert buffer to string if needed
    const messageStr = data instanceof Buffer ? data.toString() : data.toString();

    // Parse the message
    const message = JSON.parse(messageStr) as WebSocketMessage;
    console.log("Received message:", message);

    // You can handle different message types here
    switch (message.type) {
      case "play":
        console.log("Playing:", message.value);
        break;

      case "reader":
        console.log("Reader status:", message.value);
        break;

      default:
        console.log("Unknown message type received");
    }
  } catch (error) {
    console.error("Error parsing message:", error);
  }
});

// Handle connection errors
ws.on("error", (error: Error) => {
  console.error("WebSocket error:", error);
});

// Handle connection close
ws.on("close", () => {
  console.log("Disconnected from server");
});

// Close connection after some time (for demo purposes)
setTimeout(() => {
  ws.close();
  console.log("Closing connection");
}, 5000);

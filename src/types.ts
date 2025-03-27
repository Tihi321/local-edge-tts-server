import WebSocket from "ws";

// Message types
export type MessageType = "read" | "play" | "identify" | "reader" | "status";

// Base message interface
export interface Message {
  type: MessageType;
  value?: string;
}

// Read message
export interface ReadMessage extends Message {
  type: "read";
  value: string;
}

// Play message
export interface PlayMessage extends Message {
  type: "play";
  value: string;
}

// Identify message
export interface IdentifyMessage extends Message {
  type: "identify";
  value: string;
}

// Reader status message
export interface ReaderStatusMessage extends Message {
  type: "reader";
  value: "connected" | "disconnected";
}

// Status request message
export interface StatusRequestMessage extends Message {
  type: "status";
}

// Union type for all message formats
export type WebSocketMessage =
  | ReadMessage
  | PlayMessage
  | IdentifyMessage
  | ReaderStatusMessage
  | StatusRequestMessage;

// Server state interface
export interface ServerState {
  readerConnected: boolean;
  readerClient: WebSocket | null;
  clients: Set<WebSocket>;
}

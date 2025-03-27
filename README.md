# TypeScript WebSocket Message Server

A simple WebSocket server that handles specific message types between clients, built with TypeScript.

## Setup

```bash
# Install dependencies
yarn install

# Build the TypeScript project
yarn build

# Start the server (default port: 7123)
yarn start

# Start the server with a custom port
yarn start --port 8080
```

## Development

```bash
# Watch mode for development
yarn dev

# Run the example client
yarn client
```

## Building Executable

You can create a standalone executable for Windows using:

```bash
# Build executable for Windows (Node.js 20.18.0)
yarn package
```

This will create an executable in the `dist` directory optimized for Windows.

## Command-line Options

The server accepts the following command-line options:

```
-p, --port <number>  Specify the port number (default: 7123)
```

Example:

```bash
# When running with Node.js
yarn start --port 9000

# When running the executable
local-edge-tts-server.exe --port 9000
```

## Project Structure

- `/src` - TypeScript source files
- `/build` - Compiled JavaScript output
- `/dist` - Windows executable (after packaging)

## Message Types

The server handles the following JSON message types:

### Read Message

```json
{
  "type": "read",
  "value": "some text"
}
```

When received, the server will broadcast a play message to all clients.

### Identify Message

```json
{
  "type": "identify",
  "value": "reader"
}
```

Used by reader clients to identify themselves.

### Status Request

```json
{
  "type": "status"
}
```

Requests the current reader connection status.

## Client Responses

### Play Message

```json
{
  "type": "play",
  "value": "text from read message"
}
```

Broadcast to all clients when a read message is received.

### Reader Status

```json
{
  "type": "reader",
  "value": "connected"
}
```

Or

```json
{
  "type": "reader",
  "value": "disconnected"
}
```

Broadcast when reader connection status changes or in response to status requests.

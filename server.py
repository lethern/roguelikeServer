import asyncio
import os
import websockets

connected_clients = set()

async def handler(websocket):
    connected_clients.add(websocket)
    print(f"client connected")
    try:
        async for message in websocket:
            for client in connected_clients:
                if client != websocket:
                    await client.send(message)
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        connected_clients.remove(websocket)
        print(f"client disconnected")

async def main():
    port = int(os.environ.get("PORT", 10000))
    async with websockets.serve(handler, "0.0.0.0", port):
        print(f"server running on port {port}")
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
import asyncio
import os
import websockets
import json
import traceback

connected_clients = set()
master_client = None

SERVER_CREDENTIAL = {
    "credential": os.environ.get("TURN_CREDENTIAL", "")
}

async def safe_send(client, message):
    try:
        await client.send(message)
        return True
    except Exception:
        print(f"send failed: {e}")
        return False

async def handler(websocket):
    global master_client
    connected_clients.add(websocket)
    
    if master_client is None:
        master_client = websocket
        is_master = True
    else:
        is_master = False

    try:
        try:
            await websocket.send(json.dumps({
                "type": "credentials",
                "master": is_master,
                **SERVER_CREDENTIAL
            }))
        except Exception:
            print(f"failed sending credentials: {e}")

        async for message in websocket:
            dead_clients = []
            
            for client in list(connected_clients):
                if client == websocket:
                    continue
                ok = await safe_send(client, message)
                if not ok:
                    dead_clients.append(client)
            
            for client in dead_clients:
                connected_clients.discard(client)
                if master_client == client:
                    master_client = next(iter(connected_clients)) if connected_clients else None

    except websockets.exceptions.ConnectionClosed:
        print(f"connection closed: {e.code} {e.reason}")

    except Exception:
        print("UNHANDLED EXCEPTION")
        print(traceback.format_exc())
    finally:
        connected_clients.discard(websocket)
        print("client disconnected")
        if master_client == websocket:
            master_client = next(iter(connected_clients)) if connected_clients else None


async def main():
    port = int(os.environ.get("PORT", 10000))
    async with websockets.serve(
        handler,
        "0.0.0.0",
        port,
        ping_interval=20,
        ping_timeout=20,
        origins=None
    ):
        print(f"server running on port {port}")
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
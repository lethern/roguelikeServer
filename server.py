import asyncio
import os
import websockets
import json
import traceback

connected_clients = set()

SERVER_CREDENTIAL = {
    "credential": os.environ.get("TURN_CREDENTIAL", "")
}

async def safe_send(client, message):
    try:
        await client.send(message)
        return True
    except Exception as e:
        print(f"send failed: {e}")
        return False

async def handler(websocket):
    connected_clients.add(websocket)
    print("client connected")

    try:
        try:
            await websocket.send(json.dumps({
                "type": "credentials",
                **SERVER_CREDENTIAL
            }))
        except Exception as e:
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

    except websockets.exceptions.ConnectionClosed as e:
        print(f"connection closed: {e.code} {e.reason}")

    except Exception:
        print("UNHANDLED EXCEPTION")
        print(traceback.format_exc())

    finally:
        connected_clients.discard(websocket)
        print("client disconnected")


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
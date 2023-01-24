import { serve } from "deno/http/server.ts";
import handler from "@/handlers/mod.ts";
import middlewares from "@/middlewares/mod.ts";
import { Action } from "@/models/action.ts";

const sockets: WebSocket[] = [];

function handleCommand(ws: WebSocket, action: Action) {
  const { actions, broadcast } = middlewares(handler)(action);
  if (broadcast) {
    for (const socket of sockets) {
      for (const action of actions) {
        socket.send(JSON.stringify(action));
      }
    }
  } else {
    for (const action of actions) {
      ws.send(JSON.stringify(action));
    }
  }
}

function handleMessage(ws: WebSocket, data: string) {
  try {
    const action = JSON.parse(data);
    handleCommand(ws, action);
  } catch {
    const action = { action: "error", payload: "wrong format!" };
    ws.send(JSON.stringify(action));
    console.warn(`Unrecognized data: ${data}`);
  }
}

function handleError(e: Event | ErrorEvent) {
  console.warn(e instanceof ErrorEvent ? e.message : e.type);
}

function reqHandler(req: Request) {
  if (new URL(req.url).pathname !== "/ws") {
    return new Response(null, { status: 404 });
  }
  if (req.headers.get("upgrade") !== "websocket") {
    return new Response(null, { status: 501 });
  }
  const { socket: ws, response } = Deno.upgradeWebSocket(req);
  sockets.push(ws);
  ws.onmessage = (m) => handleMessage(ws, m.data);
  ws.onclose = () => {
    const index = sockets.indexOf(ws);
    sockets.splice(index, 1);
  };
  ws.onerror = handleError;
  return response;
}

serve(reqHandler, { port: 8000 });

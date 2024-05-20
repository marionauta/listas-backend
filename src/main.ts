import { serve } from "deno/http/server.ts";
import handler from "@/handlers/mod.ts";
import middlewares from "@/middlewares/mod.ts";
import { Action } from "@/models/action.ts";
import { actions } from "@/models/handler_response.ts";

const sockets: WebSocket[] = [];

function handleCommand(ws: WebSocket, action: Action) {
  const response = middlewares(handler)(action);
  const sendSockets: WebSocket[] = response.broadcast ? sockets : [ws];
  for (const socket of sendSockets) {
    for (const action of actions(response)) {
      socket.send(JSON.stringify(action));
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

import { serve } from "deno/http/server.ts";
import { addAction } from "@/actions/add_action.ts";
import { deleteCompletedAction } from "@/actions/delete_completed_action.ts";
import { listAction } from "@/actions/list_action.ts";
import { updateAction } from "@/actions/update_action.ts";

const sockets: WebSocket[] = [];

// deno-lint-ignore no-explicit-any
function handleCommand(ws: WebSocket, command: string, payload: any) {
  switch (command) {
    case "ping": {
      console.log("popgogong");
      const response = { action: "pong" };
      return ws.send(JSON.stringify(response));
    }
    case "add": {
      const item = addAction({ list: "uno", ...payload });
      const response = { action: "itemUpdated", payload: item };
      for (const socket of sockets) {
        socket.send(JSON.stringify(response));
      }
      return;
    }
    case "update": {
      const item = updateAction({ list: "uno", ...payload });
      const response = { action: "itemUpdated", payload: item };
      for (const socket of sockets) {
        socket.send(JSON.stringify(response));
      }
      return;
    }
    case "list": {
      const items = listAction({ list: "uno" });
      for (const item of items) {
        const response = { action: "itemUpdated", payload: item };
        ws.send(JSON.stringify(response));
      }
      return;
    }
    case "delete-completed": {
      const items = deleteCompletedAction({ list: "uno" });
      for (const item of items) {
        const response = { action: "itemDeleted", payload: item };
        for (const socket of sockets) {
          socket.send(JSON.stringify(response));
        }
      }
      return;
    }
    default:
      return ws.send(JSON.stringify({ error: "unrecognized command!" }));
  }
}

function handleMessage(ws: WebSocket, data: string) {
  try {
    const message = JSON.parse(data);
    handleCommand(ws, message.action, message.payload);
  } catch {
    console.warn(`Unrecognized data: ${data}`);
  }
}

function handleError(e: Event | ErrorEvent) {
  console.log(e instanceof ErrorEvent ? e.message : e.type);
}

function reqHandler(req: Request) {
  if (new URL(req.url).pathname != "/ws") {
    return new Response(null, { status: 404 });
  }
  if (req.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 501 });
  }
  const { socket: ws, response } = Deno.upgradeWebSocket(req);
  sockets.push(ws);
  ws.onmessage = (m) => handleMessage(ws, m.data);
  ws.onclose = () => {
    const index = sockets.indexOf(ws);
    sockets.splice(index, 1);
    console.log("Disconnected from client ...");
  };
  ws.onerror = (e) => handleError(e);
  return response;
}
console.log("Waiting for client ...");

serve(reqHandler, { port: 8000 });

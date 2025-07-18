import fp from "fastify-plugin";
import websocket from "@fastify/websocket";
import type { FastifyInstance, FastifyRequest } from "fastify";
import { WebSocket } from "ws";

declare module "fastify" {
  interface FastifyInstance {
    notify(userId: string, payload: any): void;
  }
}

export default fp(async function websocketPlugin(fastify: FastifyInstance) {
  // registra o plugin WS
  await fastify.register(websocket, {
    options: { clientTracking: true },
  });

  // rota de upgrade WebSocket
  fastify.get(
    "/ws",
    { websocket: true },
    function (this: FastifyInstance, connection: any, request: FastifyRequest) {
      // Extrai userId da URL raw
      const url = new URL(
        request.raw.url || "",
        `http://${request.headers.host}`
      );
      const userId = url.searchParams.get("userId");

      if (!userId) {
        // Tenta diferentes formas de fechar a conexão
        if (connection.close) {
          connection.close(4001, "userId missing");
        } else if (connection.socket && connection.socket.close) {
          connection.socket.close(4001, "userId missing");
        } else if (connection.end) {
          connection.end();
        }
        return;
      }

      // Determina qual é o WebSocket real e anexa o userId
      const ws = connection.socket || connection;
      (ws as any).userId = userId;
      this.log.info(`WS conectado user=${userId}`);

      // Escuta o evento de desconexão
      ws.on("close", () => {
        this.log.info(`WS desconectado user=${userId}`);
      });
    }
  );

  // helper global: envia só p/ sockets com matching userId
  fastify.decorate("notify", (userId: string, payload: any) => {
    const msg = JSON.stringify({ event: "notification", data: payload });

    fastify.websocketServer.clients.forEach((client: any) => {
      if (client.readyState === WebSocket.OPEN && client.userId === userId) {
        client.send(msg);
      }
    });
  });
});

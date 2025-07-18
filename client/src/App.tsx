import { useEffect } from "react";

export const App = () => {
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000/ws?userId=test");
    ws.onopen = () => console.log("WS aberto");
    ws.onmessage = (ev) => console.log("Recebido:", ev.data);
    ws.onclose = () => console.log("WS fechado");
    ws.onerror = (err) => console.error("WS erro", err);
    return () => ws.close();
  }, []);

  return (
    <div>
      <h1>APP</h1>
    </div>
  );
};

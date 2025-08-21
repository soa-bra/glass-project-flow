// طبقة WebSocket عامة (Node/Browser)
export class WsTransport {
  private ws: WebSocket | null = null;
  private url: string;
  private onMsg?: (data:any)=>void;

  constructor(url: string){ this.url = url; }

  connect(){
    this.ws = new WebSocket(this.url);
    this.ws.onopen = ()=> console.log("[ws] open");
    this.ws.onclose = ()=> console.log("[ws] close");
    this.ws.onerror = (e)=> console.warn("[ws] error", e);
    this.ws.onmessage = (e)=> {
      try { const data = JSON.parse(e.data as any); this.onMsg?.(data); }
      catch { this.onMsg?.(e.data); }
    };
  }
  send(data:any){ this.ws?.send(JSON.stringify(data)); }
  onMessage(cb:(data:any)=>void){ this.onMsg = cb; }
  close(){ this.ws?.close(); }
}

/// <reference lib="webworker" />
// موجه بسيط للوصلات (Orthogonal routing بدائي)
type RouteMsg = { type:"route"; from:{x:number;y:number}; to:{x:number;y:number} };
type InitMsg = { type:"init" };
type Msg = RouteMsg | InitMsg;

self.onmessage = (e: MessageEvent<Msg>)=>{
  const msg = e.data;
  if (msg.type==="init") return;
  if (msg.type==="route"){
    const { from, to } = msg;
    // مسار مستطيل: L ثم ┘
    const mid = { x: from.x, y: to.y };
    const points = [from, mid, to];
    (self as any).postMessage({ kind:"routed", points });
  }
};
export {};

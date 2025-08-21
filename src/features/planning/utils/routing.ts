import { centerOf } from "./geometry";

export type RoutePoint = { x:number;y:number };
export type Route = RoutePoint[];

export function straightRoute(a:{x:number;y:number;w:number;h:number}, b:{x:number;y:number;w:number;h:number}): Route{
  return [ centerOf(a), centerOf(b) ];
}

export function orthogonalRoute(a:{x:number;y:number;w:number;h:number}, b:{x:number;y:number;w:number;h:number}): Route{
  const A = centerOf(a), B = centerOf(b);
  // بسيط: L-shape
  return [ A, { x:B.x, y:A.y }, B ];
}

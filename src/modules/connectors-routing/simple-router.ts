import type { Route } from "@/src/features/planning/utils/routing";
import { straightRoute } from "@/src/features/planning/utils/routing";

export function routeSimple(a:any, b:any): Route {
  return straightRoute(a,b);
}

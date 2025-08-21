import type { Route } from "@/src/features/planning/utils/routing";
import { orthogonalRoute } from "@/src/features/planning/utils/routing";
export function routeOrthogonal(a:any,b:any): Route { return orthogonalRoute(a,b); }

import type { SGNode } from "./node";
export function sortByZ(nodes:SGNode[]){
  return [...nodes].sort((a,b)=> (a.z??0) - (b.z??0));
}

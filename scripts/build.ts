import { execSync } from "node:child_process";
console.log("• Type-check");
execSync("tsc -p tsconfig.json --noEmit", { stdio:"inherit" });
console.log("• Build (Vite)");
execSync("vite build", { stdio:"inherit" });
console.log("√ Build done");

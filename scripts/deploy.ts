import { execSync } from "node:child_process";
const target = process.env.DEPLOY_TARGET || "vercel";
if (target === "vercel") {
  execSync("npx vercel --prod", { stdio:"inherit" });
} else {
  console.log("Define DEPLOY_TARGET=vercel or add your provider logic.");
}

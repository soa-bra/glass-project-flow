import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, basename, extname } from "node:path";

const roots = [
  "src/features/planning/components",
  "src/features/planning/smart-elements",
  "src/modules",
  "src/components",
];
function gen(dir:string){
  const files = readdirSync(dir).filter(f=>{
    const p = join(dir,f);
    const st = statSync(p);
    return st.isDirectory() || [".ts",".tsx"].includes(extname(f));
  });
  const lines:string[] = [];
  for (const f of files){
    const p = join(dir,f);
    if (statSync(p).isDirectory()){
      gen(p);
      lines.push(`export * from "./${f}";`);
    } else {
      const name = basename(f, extname(f));
      if (name!=="index") lines.push(`export * from "./${name}";`);
    }
  }
  writeFileSync(join(dir,"index.ts"), lines.join("\n"));
  console.log("• barrel:", dir);
}
for (const r of roots) gen(r);

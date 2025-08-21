import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const out = join(process.cwd(), "src/assets/icons");
mkdirSync(out, { recursive: true });

const icons: Record<string,string> = {
  "cursor.svg": `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#111" d="M4 3l14 7-6 2-2 6z"/></svg>`,
  "hand.svg": `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#111" d="M6 12l2-8h2l1 6 2-5h2l1 5 2-3h2l-3 10-5 4z"/></svg>`,
  "shape-rect.svg": `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="6" width="16" height="12" fill="#111"/></svg>`,
  "zoom.svg": `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="7" stroke="#111" fill="none"/><path d="M14 14l6 6" stroke="#111"/></svg>`,
};
for (const [name, svg] of Object.entries(icons)){
  writeFileSync(join(out, name), svg);
}
console.log("√ icons generated:", Object.keys(icons).length);

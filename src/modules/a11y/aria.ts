export function aria(k:string, v:any){ return { [`aria-${k}`]: v }; }
export function rovingTabIndex(container:HTMLElement){
  const focusables = Array.from(container.querySelectorAll<HTMLElement>("[tabindex]"));
  container.addEventListener("keydown", (e)=>{
    if (e.key!=="ArrowRight" && e.key!=="ArrowLeft") return;
    const idx = focusables.findIndex(f=> f===document.activeElement);
    const dir = e.key==="ArrowRight" ? 1 : -1;
    const n = (idx + dir + focusables.length) % focusables.length;
    focusables[n].focus();
  });
}

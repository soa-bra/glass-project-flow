import type { Command, CommandResult } from "@/src/features/planning/types/commands";
import { execInsert } from "./insert";
import { execMove } from "./move";
import { execStyle } from "./style";
import { execConnect } from "./connect";
import { execGroup } from "./group";
import { execUnGroup } from "./ungroup";

export function exec(cmd:Command): CommandResult{
  switch(cmd.kind){
    case "insert": return execInsert(cmd);
    case "move": return execMove(cmd);
    case "style": return execStyle(cmd);
    case "connect": return execConnect(cmd);
    case "group": return execGroup(cmd);
    case "ungroup": return execUnGroup(cmd);
    case "resize": // تبسيط: نعاملها كـ style على w/h/x/y
      return execStyle({ kind:"style", id: cmd.id, patch:{}, target:"widget" });
    default: return { ok:false, error:"unknown command" };
  }
}

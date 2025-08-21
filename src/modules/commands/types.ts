import type { Command, CommandResult } from "@/src/features/planning/types/commands";
export type CommandExecutor = { exec:(cmd:Command)=>CommandResult };

export type Role = "Owner"|"Editor"|"Commenter"|"Viewer";
export type Participant = { id:string; name:string; color?:string; role?:Role; email?:string; avatar?:string };
export type CursorPresence = { id:string; x:number; y:number; color?:string; lockedBy?:string|null };
export type ChatMessage = { id:string; authorId:string; authorName:string; at:number; text:string; reactions?:Record<string,number> };

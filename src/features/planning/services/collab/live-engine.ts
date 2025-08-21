// src/features/planning/services/collab/live-engine.ts
'use client';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { getEnv } from '@/config/env';

type Handler = (payload:any)=>void;

export class LiveEngine {
  private static _inst: LiveEngine|null = null;
  private channel!: RealtimeChannel;
  private handlers: Record<string, Handler[]> = {};

  static async instance(){
    if (this._inst) return this._inst;
    const env = getEnv();
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { realtime: { params: { eventsPerSecond: 20 } } });
    const channel = supabase.channel(`board:default`, { config: { broadcast:{ack:true}, presence:{key: crypto.randomUUID()} } });

    await channel.subscribe((status)=>{
      if (status==='SUBSCRIBED') {
        // presence join
        channel.track({ user: 'guest', ts: Date.now() });
      }
    });

    const inst = new LiveEngine();
    inst.channel = channel;

    // listen
    channel.on('broadcast', { event: 'delta' }, ({ payload })=>{
      inst.handlers['delta']?.forEach(cb=>cb(payload));
    });

    this._inst = inst;
    return inst;
  }

  subscribe(event:string, cb: Handler){
    this.handlers[event] = this.handlers[event] || [];
    this.handlers[event].push(cb);
  }

  static _emit(event:string, payload:any){
    (async()=>{
      const inst = await LiveEngine.instance();
      inst.channel.send({ type:'broadcast', event, payload });
    })();
  }
}

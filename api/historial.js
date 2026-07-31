import { kv } from '@vercel/kv';

export const config = { runtime: 'edge' };

const KEY_HIST = 'lista-compras-historial';
const KEY_OLD = 'lista-compras-data'; // formato anterior combinado, para migrar datos existentes

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async function handler(req) {
  try {
    if (req.method === 'GET') {
      let historial = await kv.get(KEY_HIST);
      if (historial == null) {
        const viejo = await kv.get(KEY_OLD);
        historial = (viejo && viejo.historial) || [];
        if (historial.length) {
          await kv.set(KEY_HIST, historial);
        }
      }
      return json(historial || []);
    }

    if (req.method === 'POST') {
      const body = await req.json();
      await kv.set(KEY_HIST, body.historial || []);
      return json({ ok: true });
    }

    return json({ error: 'Método no permitido' }, 405);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

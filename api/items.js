import { kv } from '@vercel/kv';

export const config = { runtime: 'edge' };

const KEY_ITEMS = 'lista-compras-items';
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
      let items = await kv.get(KEY_ITEMS);
      if (items == null) {
        // Migración: si todavía no existe la key nueva, buscamos en el formato viejo
        const viejo = await kv.get(KEY_OLD);
        items = (viejo && viejo.items) || [];
        if (items.length) {
          await kv.set(KEY_ITEMS, items);
        }
      }
      return json(items || []);
    }

    if (req.method === 'POST') {
      const body = await req.json();
      await kv.set(KEY_ITEMS, body.items || []);
      return json({ ok: true });
    }

    return json({ error: 'Método no permitido' }, 405);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

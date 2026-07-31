import { kv } from '@vercel/kv';

export const config = { runtime: 'edge' };

const KEY_LISTAS = 'lista-compras-listas';
const KEY_OLD_ITEMS = 'lista-compras-items'; // formato anterior: un solo listado
const KEY_OLD_DATA = 'lista-compras-data';   // formato aun mas viejo, combinado

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async function handler(req) {
  try {
    if (req.method === 'GET') {
      let listas = await kv.get(KEY_LISTAS);

      if (listas == null) {
        // Migracion desde versiones anteriores de la app
        let itemsViejos = await kv.get(KEY_OLD_ITEMS);
        if (itemsViejos == null) {
          const viejoCombo = await kv.get(KEY_OLD_DATA);
          itemsViejos = (viejoCombo && viejoCombo.items) || [];
        }
        const hoy = new Date().toISOString().slice(0, 10);
        listas = [{ id: 'lista_migrada', fecha: hoy, nombre: '', items: itemsViejos || [] }];
        await kv.set(KEY_LISTAS, listas);
      }

      return json(listas || []);
    }

    if (req.method === 'POST') {
      const body = await req.json();
      await kv.set(KEY_LISTAS, body.listas || []);
      return json({ ok: true });
    }

    return json({ error: 'Método no permitido' }, 405);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

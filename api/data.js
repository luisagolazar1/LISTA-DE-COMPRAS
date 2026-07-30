import { kv } from '@vercel/kv';

const KEY = 'lista-compras-data';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const data = await kv.get(KEY);
      return res.status(200).json(data || { items: [], historial: [] });
    }

    if (req.method === 'POST') {
      const { items, historial } = req.body || {};
      await kv.set(KEY, { items: items || [], historial: historial || [] });
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

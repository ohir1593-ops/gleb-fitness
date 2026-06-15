const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, contact, goal, comment } = req.body;

    const msg = `🔥 НОВАЯ ЗАЯВКА с сайта!\n\n` +
      `👤 Имя: ${name || '—'}\n` +
      `📱 Контакт: ${contact || '—'}\n` +
      `🎯 Цель: ${goal || '—'}\n` +
      `💬 Комментарий: ${comment || '—'}\n\n` +
      `⏰ ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`;

    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: msg,
        parse_mode: 'HTML'
      })
    });

    const tgData = await tgRes.json();

    if (!tgData.ok) {
      return res.status(500).json({ error: 'Telegram error', details: tgData });
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}

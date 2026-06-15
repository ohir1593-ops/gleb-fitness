const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ ok: true });

  try {
    const { message } = req.body;
    if (!message) return res.status(200).json({ ok: true });

    const text = message.text || '';
    const from = message.from;
    const userName = from.first_name + (from.last_name ? ' ' + from.last_name : '');
    const userHandle = from.username ? '@' + from.username : 'нет username';

    let reply = '';

    if (text === '/start') {
      reply = `Привет! 👋\n\nЭто бот Глеба Дохевича — персонального фитнес тренера.\n\n💪 Напиши мне напрямую:\n✈ Telegram: @DoHevich\n📞 Телефон: +7 (965) 948-69-24\n\nИли оставь заявку на сайте — Глеб ответит в течение часа!`;
    } else {
      reply = `Спасибо за сообщение! Глеб скоро свяжется с тобой. 💪\n\nИли напиши напрямую: @DoHevich`;
    }

    // Send reply to user
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: message.chat.id, text: reply })
    });

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(200).json({ ok: true });
  }
}

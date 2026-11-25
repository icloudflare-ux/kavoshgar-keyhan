import { requireUser } from "../server/auth";
// --- Moon Phase Calculation Logic (needed for signal strength) ---
const LUNAR_CYCLE_DAYS = 29.53;
const NEW_MOON_REFERENCE_UTC = new Date('2024-01-11T11:57:00Z').getTime();
const getMoonPhase = (date: Date): number => {
    const msSinceNewMoon = date.getTime() - NEW_MOON_REFERENCE_UTC;
    const daysSinceNewMoon = msSinceNewMoon / (1000 * 60 * 60 * 24);
    const phase = (daysSinceNewMoon % LUNAR_CYCLE_DAYS) / LUNAR_CYCLE_DAYS;
    return phase < 0 ? 1 + phase : phase;
};

// Vercel Serverless Function handler
export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    return response.status(405).json({ message: 'فقط متد POST مجاز است' });
  }

  const user = await requireUser(request, response);
  if (!user) return;
  if (user.app_metadata?.role !== 'admin') {
    return response.status(403).json({ error: 'Administrator access required.' });
  }

  // Read secrets from server environment variables for security
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('Telegram environment variables are not set on the server.');
    return response.status(500).json({ success: false, error: 'Server configuration error.' });
  }

  try {
    const { signal, isNahs, currentPlanet } = request.body || {};

    if (!signal || typeof signal.symbol !== 'string' || signal.symbol.length > 30 || !['BUY', 'SELL'].includes(signal.type) || !Number.isFinite(Number(signal.price)) || Number(signal.price) <= 0) {
        return response.status(400).json({ error: 'Invalid signal data received.' });
    }

    const planetaryRuler = typeof currentPlanet?.persian === 'string' ? currentPlanet.persian.slice(0, 40) : 'نامشخص';
    let power = 50;
    let powerLabel = 'Medium';

    if (currentPlanet) {
      switch (currentPlanet.name) {
          case 'Jupiter': power += 40; break;
          case 'Venus': power += 30; break;
          case 'Sun':
          case 'Moon': power += 15; break;
          case 'Mercury': power += 0; break;
          case 'Mars': power -= 35; break;
          case 'Saturn': power -= 40; break;
      }
    }
  
    const moonPhase = getMoonPhase(new Date());
    if (moonPhase >= 0.45 && moonPhase < 0.55) power += 20;
    else if (moonPhase > 0.05 && moonPhase < 0.45) power += 10;
    else if (moonPhase > 0.55 && moonPhase < 0.95) power -= 10;
    
    power = Math.max(5, Math.min(95, power));
  
    if (power > 80) powerLabel = 'Very High';
    else if (power > 65) powerLabel = 'High';
    else if (power > 35) powerLabel = 'Medium';
    else if (power > 20) powerLabel = 'Low';
    else powerLabel = 'Very Low';
  
    const signalStrength = `${Math.round(power)}% (${powerLabel})`;
    const typeText = signal.type === 'BUY' ? 'خرید (BUY)' : 'فروش (SELL)';
    const typeEmoji = signal.type === 'BUY' ? '🟢' : '🔴';
    const channelId = '@VIP_Signal_bot';
  
    const message = `
✨ **VIP COSMIC SIGNAL** ✨
━━━━━━━━━━━━━━
🪙 **ارز:** #${signal.symbol}
📈 **نوع:** ${typeText} ${typeEmoji}
💰 **قیمت ورود:** ${signal.price}
━━━━━━━━━━━━━━
🌌 **وضعیت کواکب:** ${isNahs ? 'نحس (احتیاط) ⚠️' : 'سعد (مبارک) ✅'}
🪐 **حاکم ساعت:** ${planetaryRuler}
🔭 **قدرت سیگنال:** ${signalStrength}
━━━━━━━━━━━━━━
🛰 *ارسال شده توسط سیستم هوشمند کاوشگر کیهان*
⚠️ *مدیریت سرمایه فراموش نشود.*
🆔 ${channelId}
    `.trim().replace(/\*/g, '');

    const apiResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
      }),
    });

    const result = await apiResponse.json();
    if (apiResponse.ok) {
      response.status(200).json({ success: true });
    } else {
      console.error('Telegram API Error:', result);
      response.status(apiResponse.status).json({ success: false, error: 'Failed to send Telegram message.' });
    }
  } catch (error: any) {
    console.error('Error in send-telegram API:', error.message);
    response.status(500).json({ success: false, error: 'Internal server error.' });
  }
}
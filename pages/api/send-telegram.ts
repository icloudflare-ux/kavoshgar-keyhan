
// Adapted from user's Next.js code to a generic serverless function
export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    return response.status(405).json({ message: 'فقط متد POST مجاز است' });
  }

  // Read secrets from server environment variables for security
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('Telegram environment variables are not set on the server.');
    return response.status(500).json({ success: false, error: 'Server configuration error.' });
  }

  try {
    const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
    const { signal, isNahs } = body;

    if (!signal || signal.symbol === undefined || signal.type === undefined || signal.price === undefined || isNahs === undefined) {
        throw new Error('Invalid signal data received.');
    }
    
    // Format the message with Markdown for Telegram
    const message = `
🔵 **سیگنال جدید ترید - VIP**
━━━━━━━━━━━━━━
🪙 **ارز:** ${signal.symbol}
📈 **نوع عملیات:** ${signal.type === 'BUY' ? 'خرید 🟢' : 'فروش 🔴'}
💰 **قیمت ورود:** ${signal.price}
🪐 **وضعیت نجومی:** ${isNahs ? 'نحس (احتیاط) ⚠️' : 'سعد (مبارک) ✅'}
━━━━━━━━━━━━━━
🛰 *ارسال شده توسط سیستم هوشمند کاوشگر کیهان*
  `.trim();

    const apiResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const result = await apiResponse.json();
    if (apiResponse.ok) {
      response.status(200).json({ success: true, data: result });
    } else {
      console.error('Telegram API Error:', result);
      response.status(apiResponse.status).json({ success: false, error: 'Failed to send Telegram message.', details: result });
    }
  } catch (error: any) {
    console.error('Error in send-telegram API:', error.message);
    response.status(500).json({ success: false, error: 'Internal server error.' });
  }
}

export const onRequestPost = async ({ request, env }) => {
  try {
    const body = await request.json();

    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim();
    const subject = String(body?.subject || '').trim();
    const message = String(body?.message || '').trim();
    const company = String(body?.company || '').trim(); // honeypot
    const submittedAt = Number(body?.submittedAt || 0);

    if (!name || !email || !subject || !message) {
      return json({ ok: false, error: 'Missing required fields' }, 400);
    }

    if (company) {
      return json({ ok: true });
    }

    if (!submittedAt || Date.now() - submittedAt < 2500) {
      return json({ ok: false, error: 'Too fast' }, 400);
    }

    if (!env.RESEND_API_KEY) {
      return json({ ok: false, error: 'Server not configured' }, 500);
    }

    const to = env.CONTACT_TO || 'ffinniff@gmail.com';
    const from = env.CONTACT_FROM || 'onboarding@resend.dev';

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `[FFINN] ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    });

    if (!resendRes.ok) {
      const errorText = await resendRes.text();
      return json({ ok: false, error: `Mail provider error: ${errorText}` }, 502);
    }

    return json({ ok: true });
  } catch {
    return json({ ok: false, error: 'Bad request' }, 400);
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

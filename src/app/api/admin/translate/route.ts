import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/utils/auth';

// Эндпоинт перевода текста для админки.
// Использует те же переменные окружения, что и scripts/translate-i18n.mjs:
//   I18N_TRANSLATE_API_KEY, I18N_TRANSLATE_API_URL, I18N_TRANSLATE_MODEL
export async function POST(request: NextRequest) {
  try {
    await requireAuth(request);

    const body = await request.json();
    const { text, from = 'ru', to = 'en' } = body;

    if (typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (text.length > 10000) {
      return NextResponse.json({ error: 'Text is too long' }, { status: 400 });
    }

    const apiKey = process.env.I18N_TRANSLATE_API_KEY?.trim();
    const apiUrl = process.env.I18N_TRANSLATE_API_URL?.trim();
    const model = process.env.I18N_TRANSLATE_MODEL?.trim();

    // Явные ошибки вместо молчаливых дефолтов
    const missingVars = [
      !apiKey && 'I18N_TRANSLATE_API_KEY',
      !apiUrl && 'I18N_TRANSLATE_API_URL',
      !model && 'I18N_TRANSLATE_MODEL',
    ].filter(Boolean);

    if (missingVars.length > 0) {
      console.error('Translation is not configured. Missing env vars:', missingVars.join(', '));
      return NextResponse.json(
        { error: `Translation is not configured. Missing env vars: ${missingVars.join(', ')}` },
        { status: 500 }
      );
    }

    // Допускаем и базовый URL, и полный путь до chat/completions
    const endpoint = apiUrl!.endsWith('/chat/completions')
      ? apiUrl!
      : `${apiUrl!.replace(/\/+$/, '')}/chat/completions`;

    let response: Response;
    try {
      response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: [
              `You are a professional translator. Translate the user's text from ${from} to ${to}.`,
              'Rules:',
              '- Return ONLY the translated text, without quotes, comments or explanations.',
              '- Keep placeholders like {{name}} or {{count}} unchanged.',
              '- Preserve line breaks (\\n), list structure and special characters (including emojis).',
              '- Keep the original tone: marketing texts stay marketing, technical stay technical.',
              '- If the text is already in the target language, return it as is.',
            ].join(' '),
          },
          { role: 'user', content: text },
        ],
        temperature: 0.3,
      }),
    });
    } catch (fetchError: any) {
      console.error('Failed to reach translation API:', endpoint, fetchError);
      return NextResponse.json(
        { error: `Failed to reach I18N_TRANSLATE_API_URL (${endpoint}): ${fetchError?.message || 'network error'}` },
        { status: 502 }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Translation API error:', response.status, errorText);

      let detail = errorText;
      try {
        const parsed = JSON.parse(errorText);
        detail = parsed?.error?.message ?? parsed?.message ?? errorText;
      } catch {
        // ответ не JSON — оставляем как есть
      }

      const hint = [400, 404].includes(response.status) ? ' (check I18N_TRANSLATE_MODEL)' : '';

      return NextResponse.json(
        { error: `Translation API error (HTTP ${response.status}): ${String(detail).slice(0, 300)}${hint}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const translated: string | undefined = data?.choices?.[0]?.message?.content;

    if (!translated || !translated.trim()) {
      return NextResponse.json({ error: 'Empty translation result' }, { status: 502 });
    }

    return NextResponse.json({ translated: translated.trim() });
  } catch (error: any) {
    console.error('Error translating text:', error);

    if (error.message === 'Authentication required' || error.message === 'Admin access required') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to translate' },
      { status: 500 }
    );
  }
}

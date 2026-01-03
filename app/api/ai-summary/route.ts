import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAyG63QKPfEo4-Np3heSfz_gPkwDWZHbJM';
    const prompt = `Eres el asistente de HoyMismo Paquetería. El paquete está en estado: '${status}'. Responde JSON: {"title": "Título corto y amigable", "explanation": "Explicación breve para el cliente en tono profesional pero cálido.", "icon": "fa-solid fa-check"}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) {
      throw new Error('Gemini API error');
    }

    const result = await response.json();
    let text = result.candidates[0].content.parts[0].text;
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(text);

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error en AI summary:', error);
    return NextResponse.json(
      { error: 'Error al generar resumen' },
      { status: 500 }
    );
  }
}

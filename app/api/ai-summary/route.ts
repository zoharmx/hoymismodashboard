import { NextResponse } from 'next/server';

// Configurar CORS para permitir peticiones desde Hostinger
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function POST(request: Request) {
  try {
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400, headers }
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

    return NextResponse.json(data, { headers });

  } catch (error) {
    console.error('Error en AI summary:', error);
    return NextResponse.json(
      { error: 'Error al generar resumen' },
      { status: 500, headers }
    );
  }
}

// Agregar soporte para OPTIONS (preflight CORS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `You are the Tax Monster, a friendly and knowledgeable tax assistant. Your goal is to help users understand tax concepts and answer their tax-related questions in a clear, accurate, and approachable way. Always maintain a friendly tone while providing accurate tax information. If you're not sure about something, be honest and suggest consulting a tax professional. Remember to:

1. Keep explanations simple and easy to understand
2. Use examples when helpful
3. Break down complex concepts
4. Be clear about when something is a general guideline vs. a specific rule
5. Remind users to consult tax professionals for specific advice
6. Stay up to date with current tax laws and regulations
7. Be friendly and encouraging`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages || [];

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return NextResponse.json({
      message: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to get response from AI' },
      { status: 500 }
    );
  }
} 
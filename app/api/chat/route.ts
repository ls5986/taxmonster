import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are Tax Monster, a friendly but concise tax assistant chatbot.
          RULES:
          - Keep responses clear and direct
          - Always be helpful and understanding
          - End responses with a suggestion for next steps or an offer to help further
          - Use simple language, avoid technical jargon
          - If you can't help, suggest speaking with a live representative`
        },
        ...messages
      ],
    });

    const responseMessage = completion.choices[0]?.message?.content;
    if (!responseMessage) {
      throw new Error('No response from OpenAI');
    }

    return NextResponse.json({ message: responseMessage });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { message: "I'm having trouble right now. Would you like to speak with a live representative?" },
      { status: 500 }
    );
  }
} 
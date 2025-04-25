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

    // Chat completion
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are Tax Monster, a friendly but concise tax assistant chatbot.
          RULES:
          - Keep ALL responses under 3 sentences
          - ALWAYS end with "Need more help? I can connect you with a live representative."
          - Be direct and solution-focused
          - Use simple, clear language
          - No long explanations or tax jargon`
        },
        ...messages
      ],
    });

    const responseMessage = completion.choices[0]?.message?.content;
    if (!responseMessage) {
      throw new Error('No response from OpenAI');
    }

    // Text-to-speech using the exact format specified
    const speech = await openai.audio.speech.create({
      model: "tts-1",
      input: responseMessage,
      voice: "onyx"
    });

    // Convert speech to base64
    const buffer = Buffer.from(await speech.arrayBuffer());
    const audio = buffer.toString('base64');

    return NextResponse.json({
      message: responseMessage,
      audio: audio
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
} 
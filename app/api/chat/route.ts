import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Validate API key
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

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
    // Validate request
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await req.json();
    const messages = body.messages || [];

    if (!messages.length) {
      return NextResponse.json(
        { error: 'No messages provided' },
        { status: 400 }
      );
    }

    // Call OpenAI
    console.log('Calling OpenAI with messages:', messages);
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content
        }))
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    // Validate response
    if (!completion.choices[0]?.message?.content) {
      console.error('No response from OpenAI');
      throw new Error('No response from OpenAI');
    }

    // Return response
    return NextResponse.json({
      message: completion.choices[0].message.content
    });
  } catch (error: any) {
    // Log and return error
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get response from AI',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 
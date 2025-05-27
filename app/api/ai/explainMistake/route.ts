
import { explainMistake } from '@/actions/questions';
import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  const { currentQuestion } = await request.json();
  //console.log("User Question" +currentQuestion);
  try {
    const explanation = await explainMistake(currentQuestion);
    console.log(explanation);
    return NextResponse.json({ explanation });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Failed to generate explanation' }, { status: 500 });
  }
}
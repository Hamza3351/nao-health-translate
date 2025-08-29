import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { openai } from '@/lib/openai'


export const runtime = 'nodejs' // ensure Node serverless (not Edge)


const Body = z.object({
text: z.string().min(1),
sourceLang: z.string().min(2), // e.g. 'en-US'
targetLang: z.string().min(2), // e.g. 'es-ES'
})


export async function POST(req: NextRequest) {
try {
const json = await req.json()
const { text, sourceLang, targetLang } = Body.parse(json)


if (!process.env.OPENAI_API_KEY) {
return NextResponse.json({ error: 'Missing OPENAI_API_KEY' }, { status: 500 })
}


// Use Responses API via official SDK
const resp = await openai.responses.create({
model: 'gpt-4o-mini',
input: `You are a medical translation engine. Translate the following from ${sourceLang} to ${targetLang}.
- Preserve medical terminology precisely.
- Do NOT summarize or omit details.
- Return ONLY the pure translation, no quotes.


TEXT:\n\n${text}`,
})


// SDK convenience: output_text concatenates text outputs
// @ts-ignore – types may lag; handle both shapes defensively
const outputText: string | undefined = (resp as any).output_text ||
(Array.isArray((resp as any).output) ? (resp as any).output.map((o: any) => o.content?.[0]?.text?.value || '').join('') : '')


if (!outputText) {
return NextResponse.json({ error: 'No translation returned' }, { status: 500 })
}


return NextResponse.json({ translated: outputText.trim() })
} catch (err: any) {
console.error(err)
return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 400 })
}
}
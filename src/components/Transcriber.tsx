'use client'
import { useEffect, useRef, useState } from 'react'
import LanguageSelect from './LanguageSelect'

type SpeechRecognitionType = any

export default function Transcriber() {
  const [supportsRecognition, setSupportsRecognition] = useState(false)
  const [supportsSynthesis, setSupportsSynthesis] = useState(false)

  const [recording, setRecording] = useState(false)
  const [inputLang, setInputLang] = useState('en-US')
  const [outputLang, setOutputLang] = useState('es-ES')

  const [sourceText, setSourceText] = useState('')          
  const [translatedText, setTranslatedText] = useState('') 
  const [interimText, setInterimText] = useState('')        

  const recognitionRef = useRef<SpeechRecognitionType | null>(null)
  const autoResumeRef = useRef(false)

  // Feature detection
  useEffect(() => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SR) {
      setSupportsRecognition(true)
      const rec = new SR()
      rec.continuous = true
      rec.interimResults = true
      rec.lang = 'en-US'
      recognitionRef.current = rec
    }
    if ('speechSynthesis' in window) setSupportsSynthesis(true)
  }, [])

  // Keep SR language in sync
  useEffect(() => {
    if (recognitionRef.current) recognitionRef.current.lang = inputLang
  }, [inputLang])

  const start = () => {
    const rec = recognitionRef.current
    if (!rec) return

    // (Re)attach handlers on each start so we don’t keep stale closures
    rec.onresult = (event: any) => {
      let finalChunk = ''
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i]
        const transcript = res[0].transcript
        if (res.isFinal) finalChunk += transcript + ' '
        else interim = transcript
      }
      setInterimText(interim)
      if (finalChunk) {
        setSourceText((prev) => (prev + finalChunk).trim())
        translate(finalChunk)
      }
    }
    rec.onerror = (e: any) => {
      console.error('SpeechRecognition error', e)
      setRecording(false)
      autoResumeRef.current = false
    }
    rec.onend = () => {
      setRecording(false)
      if (autoResumeRef.current) {
        try { rec.start(); setRecording(true) } catch {}
      }
    }

    try {
      rec.start()
      setRecording(true)
      autoResumeRef.current = true
    } catch (e) {
      console.error('Failed to start recognition', e)
      setRecording(false)
      autoResumeRef.current = false
    }
  }

  const stop = () => {
    autoResumeRef.current = false
    recognitionRef.current?.stop()
    setRecording(false)
  }

  async function translate(text: string) {
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, sourceLang: inputLang, targetLang: outputLang }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || `HTTP ${res.status}`)
      }
      const data = await res.json()
      if (data?.translated) setTranslatedText((prev) => (prev + ' ' + data.translated).trim())
    } catch (e) {
      console.error('translate() failed', e)
    }
  }

  const speak = () => {
    if (!translatedText || !supportsSynthesis) return
    const synth = window.speechSynthesis
    const utter = new SpeechSynthesisUtterance(translatedText)
    const voices = synth.getVoices()
    const match = voices.find(v => v.lang?.toLowerCase().startsWith(outputLang.toLowerCase())) || voices[0]
    if (match) utter.voice = match
    utter.lang = match?.lang || outputLang
    synth.cancel()
    synth.speak(utter)
  }

  const translateTyped = () => {
    const chunk = (interimText || '').trim()
    if (!chunk) return
    setSourceText((prev) => (prev + ' ' + chunk).trim())
    translate(chunk)
    setInterimText('')
  }

  const clearAll = () => {
    setSourceText('')
    setTranslatedText('')
    setInterimText('')
  }

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Healthcare Translation (Prototype)</h1>
        <span className="text-xs text-gray-500">Demo only – no PHI</span>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <LanguageSelect label="Input language (patient)" value={inputLang} onChange={setInputLang} />
        <LanguageSelect label="Output language (provider)" value={outputLang} onChange={setOutputLang} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {supportsRecognition ? (
          recording ? (
            <button onClick={stop} className="rounded-2xl bg-red-600 px-4 py-2 font-semibold text-white shadow">Stop</button>
          ) : (
            <button onClick={start} className="rounded-2xl bg-blue-600 px-4 py-2 font-semibold text-white shadow">Start Talking</button>
          )
        ) : (
          <div className="rounded-2xl bg-yellow-100 px-4 py-2 text-sm text-yellow-800">Speech recognition not supported in this browser. Use Chrome or type below.</div>
        )}
        <button onClick={speak} className="rounded-2xl bg-emerald-600 px-4 py-2 font-semibold text-white shadow">Speak Translation</button>
        <button onClick={clearAll} className="rounded-2xl bg-gray-200 px-4 py-2 font-semibold shadow">Clear</button>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">Type patient speech (fallback)</label>
        <textarea
          className="mt-1 w-full rounded-2xl border border-gray-300 bg-white p-3"
          rows={3}
          placeholder="Type here and press Translate"
          value={interimText}
          onChange={(e) => setInterimText(e.target.value)}
        />
        <button onClick={translateTyped} className="mt-2 rounded-2xl bg-gray-900 px-4 py-2 text-white">Translate</button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">Original (Live Transcript)</h2>
          <div className="h-48 overflow-auto rounded-xl border bg-gray-50 p-3 text-sm whitespace-pre-wrap">
            {(sourceText + (interimText ? ' ' + interimText : '')).trim() || '—'}
          </div>
        </section>
        <section className="rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">Translated</h2>
          <div className="h-48 overflow-auto rounded-xl border bg-gray-50 p-3 text-sm whitespace-pre-wrap">
            {translatedText || '—'}
          </div>
        </section>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        {supportsRecognition ? 'SpeechRecognition OK' : 'SpeechRecognition unavailable'} • {supportsSynthesis ? 'SpeechSynthesis OK' : 'SpeechSynthesis unavailable'}
      </div>
    </div>
  )
}
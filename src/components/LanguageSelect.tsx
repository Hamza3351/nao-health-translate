'use client'
import { LANGUAGES } from '@/lib/languages'


type Props = {
label: string
value: string
onChange: (v: string) => void
}


export default function LanguageSelect({ label, value, onChange }: Props) {
return (
<label className="block text-sm font-medium">
<span className="text-gray-700">{label}</span>
<select
className="mt-1 w-full rounded-2xl border border-gray-300 bg-white p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
value={value}
onChange={(e) => onChange(e.target.value)}
>
{LANGUAGES.map((l) => (
<option key={l.code} value={l.code}>{l.label}</option>
))}
</select>
</label>
)
}
import { useRef } from 'react'
import { useTextSize } from '../hooks/useTextSize'
import { exportAllData, importAllData, resetAllData, type ExportedData } from '../lib/db'
import { useAppStore } from '../store/AppStore'

export function ReglagesPage() {
  const { size, setSize } = useTextSize()
  const { refresh } = useAppStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleExport() {
    const data = await exportAllData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sauvegarde-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleImportFile(file: File) {
    const text = await file.text()
    const data = JSON.parse(text) as ExportedData
    await importAllData(data)
    await refresh()
    alert('Sauvegarde restaurée.')
  }

  async function handleReset() {
    if (!confirm('Tout effacer ? Cette action est définitive.')) return
    await resetAllData()
    await refresh()
    alert('Données réinitialisées.')
  }

  return (
    <div className="space-y-6 p-4 pb-24">
      <h1 className="text-2xl font-bold text-zinc-100">Réglages</h1>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-200">Taille du texte</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSize('normal')}
            className={`flex-1 rounded-xl py-3 font-medium ${
              size === 'normal' ? 'bg-sky-600 text-white' : 'bg-zinc-800 text-zinc-300'
            }`}
          >
            Normal
          </button>
          <button
            onClick={() => setSize('grand')}
            className={`flex-1 rounded-xl py-3 font-medium ${
              size === 'grand' ? 'bg-sky-600 text-white' : 'bg-zinc-800 text-zinc-300'
            }`}
          >
            Grand
          </button>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-200">Sauvegarde</h2>
        <button
          onClick={handleExport}
          className="w-full rounded-xl bg-zinc-800 py-3 font-medium text-zinc-100 active:bg-zinc-700"
        >
          Exporter mes données
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full rounded-xl bg-zinc-800 py-3 font-medium text-zinc-100 active:bg-zinc-700"
        >
          Importer une sauvegarde
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleImportFile(file)
            e.target.value = ''
          }}
        />
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-200">Réinitialiser</h2>
        <button
          onClick={handleReset}
          className="w-full rounded-xl border border-red-900 bg-red-950 py-3 font-medium text-red-300 active:bg-red-900"
        >
          Tout effacer
        </button>
      </section>
    </div>
  )
}

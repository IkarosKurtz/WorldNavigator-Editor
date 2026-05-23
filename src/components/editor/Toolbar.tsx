import { useRef } from 'react'

interface Props {
  onAddNode: () => void
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClear: () => void
  onExport: () => void
  showJsonPreview: boolean
  onToggleJsonPreview: () => void
}

export default function Toolbar({
  onAddNode,
  onImport,
  onClear,
  onExport,
  showJsonPreview,
  onToggleJsonPreview,
}: Props) {
  const importRef = useRef<HTMLInputElement>(null)

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2 z-40 bg-slate-950/70 border border-slate-800/80 p-2 rounded-xl backdrop-blur-md shadow-2xl">
      <input ref={importRef} type="file" accept=".json" className="hidden" onChange={onImport} />

      <button
        onClick={onAddNode}
        className="flex items-center gap-1.5 px-3 py-1.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-bold tracking-wider uppercase rounded-lg transition-all duration-150 cursor-pointer select-none"
      >
        <span className="material-symbols-outlined text-[16px]">add</span>
        Add Location
      </button>

      <button
        onClick={() => importRef.current?.click()}
        className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-[10px] font-bold tracking-wider uppercase rounded-lg transition-all duration-150 cursor-pointer select-none"
      >
        <span className="material-symbols-outlined text-[16px]">upload</span>
        Import
      </button>

      <button
        onClick={onToggleJsonPreview}
        className={`flex items-center gap-1.5 px-3 py-1.5 border text-[10px] font-bold tracking-wider uppercase rounded-lg transition-all duration-150 cursor-pointer select-none ${
          showJsonPreview
            ? 'border-amber-500/40 bg-amber-500/25 text-amber-300'
            : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
        }`}
      >
        <span className="material-symbols-outlined text-[16px]">code</span>
        JSON Preview
      </button>

      <button
        onClick={onClear}
        className="flex items-center gap-1.5 px-3 py-1.5 border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-[10px] font-bold tracking-wider uppercase rounded-lg transition-all duration-150 cursor-pointer select-none"
      >
        <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
        Clear
      </button>

      <button
        onClick={onExport}
        className="flex items-center gap-1.5 px-3.5 py-1.5 border border-purple-500/40 bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_12px_rgba(147,51,234,0.3)] text-[10px] font-bold tracking-wider uppercase rounded-lg transition-all duration-150 cursor-pointer select-none"
      >
        <span className="material-symbols-outlined text-[16px]">download</span>
        Export
      </button>
    </div>
  )
}

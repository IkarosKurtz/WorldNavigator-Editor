interface Props {
  onConfirm: () => void
  onCancel: () => void
}

export default function ClearConfirmModal({ onConfirm, onCancel }: Props) {
  return (
    <>
      <div
        onClick={onCancel}
        className="fixed inset-0 bg-slate-950/65 z-[998] backdrop-blur-sm"
      />
      
      <div className="fixed top-1/2 left-1/2 z-[999] glass-panel rounded-2xl p-6 shadow-2xl font-sans w-80 text-center border border-slate-800/80 animate-[modalFadeIn_0.2s_ease-out_forwards]">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-[24px] text-rose-500">
            delete_forever
          </span>
        </div>
        
        <h2 className="font-serif text-lg font-medium text-white mb-2">
          Clear Editor Canvas?
        </h2>
        
        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          This will permanently remove all locations and connections. This action is irreversible.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 border border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-800/80 hover:text-slate-300 rounded-lg text-xs font-bold uppercase transition-all duration-150 cursor-pointer select-none"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 border border-rose-500/40 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold uppercase transition-all duration-150 cursor-pointer select-none shadow-[0_0_12px_rgba(220,38,38,0.255)]"
          >
            Clear All
          </button>
        </div>
      </div>
    </>
  )
}
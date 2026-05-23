interface Props {
  x: number
  y: number
  edgeId: string
  isBidirectional: boolean
  onDelete: () => void
  onToggleBi: () => void
  onClose: () => void
}

export default function EdgeContextMenu({ x, y, isBidirectional, onDelete, onToggleBi, onClose }: Props) {
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-[998] bg-transparent" />
      
      <div
        className="fixed z-[999] bg-slate-950/90 border border-slate-800 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden font-sans min-w-[190px]"
        style={{ left: x, top: y }}
      >
        <div className="px-3.5 py-2 border-b border-slate-900 bg-slate-950/50">
          <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase">
            Connection Action
          </span>
        </div>

        <button
          onClick={() => { onToggleBi(); onClose() }}
          className="flex items-center gap-2.5 w-full px-3.5 py-2.5 bg-transparent border-none text-slate-300 hover:bg-slate-900/60 hover:text-white text-xs font-semibold text-left transition-colors cursor-pointer select-none"
        >
          <span className={`material-symbols-outlined text-[16px] ${isBidirectional ? 'text-purple-400' : 'text-slate-400'}`}>
            {isBidirectional ? 'swap_horiz' : 'arrow_forward'}
          </span>
          {isBidirectional ? 'Make one-way' : 'Make bidirectional'}
          {isBidirectional && (
            <span className="ml-auto text-[8px] font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded">
              BI
            </span>
          )}
        </button>

        <button
          onClick={() => { onDelete(); onClose() }}
          className="flex items-center gap-2.5 w-full px-3.5 py-2.5 bg-transparent border-none text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 text-xs font-semibold text-left transition-colors border-t border-slate-900 cursor-pointer select-none"
        >
          <span className="material-symbols-outlined text-[16px]">delete</span>
          Delete connection
        </button>
      </div>
    </>
  )
}

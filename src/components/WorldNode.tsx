import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'

export type NodeData = {
  label: string
  locationType: 'exterior' | 'interior'
  description?: string
  bgDay?: string
  bgAfternoon?: string
  bgNight?: string
  renPyEnabled?: boolean
  objects?: string[]
}

type WNNode = {
  id: string
  data: NodeData
  [key: string]: unknown
}

const WorldNode = memo(({ data, selected }: NodeProps<WNNode>) => {
  const isInterior = data.locationType === 'interior'
  const objectsCount = data.objects?.length ?? 0

  return (
    <div
      className={`w-60 glass-panel rounded-xl p-4 transition-all duration-300 relative select-none group
        ${selected
          ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.35)] ring-2 ring-blue-500/30'
          : 'hover:border-slate-500/80 hover:shadow-[0_4px_16px_rgba(0,0,0,0.35)] hover:scale-[1.01]'
        }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3.5 h-3.5 !bg-blue-400 !border-2 !border-slate-950 rounded-full hover:!bg-blue-300 hover:scale-110 transition-all duration-150 !left-[-7px] shadow-[0_0_8px_rgba(96,165,250,0.6)]"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3.5 h-3.5 !bg-purple-400 !border-2 !border-slate-950 rounded-full hover:!bg-purple-300 hover:scale-110 transition-all duration-150 !right-[-7px] shadow-[0_0_8px_rgba(192,132,252,0.6)]"
      />

      <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-sans text-sm font-bold text-white tracking-wide truncate">
            {data.label || 'Unnamed Location'}
          </h3>
          <span className="inline-flex items-center gap-1 mt-1 text-[10px] uppercase font-bold tracking-widest text-slate-400">
            <span className="material-symbols-outlined text-[12px]">
              {isInterior ? 'meeting_room' : 'forest'}
            </span>
            {data.locationType}
          </span>
        </div>

        {data.renPyEnabled && (
          <span className="flex-shrink-0 flex items-center justify-center bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider font-semibold">
            RenPy
          </span>
        )}
      </div>

      <div className="my-2.5">
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 group-hover:line-clamp-none italic max-h-8 group-hover:max-h-24 transition-all duration-300 ease-in-out overflow-hidden">
          {data.description || 'No description provided.'}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-slate-800/50 pt-2 text-[10px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-mono text-slate-500">ASSETS:</span>
          <div className="flex items-center gap-1">
            <span
              className={`material-symbols-outlined text-[14px] transition-colors ${
                data.bgDay ? 'text-amber-400' : 'text-slate-700'
              }`}
              title={data.bgDay ? `Day: ${data.bgDay}` : 'No Day Background'}
            >
              light_mode
            </span>
            <span
              className={`material-symbols-outlined text-[14px] transition-colors ${
                data.bgAfternoon ? 'text-orange-400' : 'text-slate-700'
              }`}
              title={data.bgAfternoon ? `Sunset: ${data.bgAfternoon}` : 'No Sunset Background'}
            >
              wb_twilight
            </span>
            <span
              className={`material-symbols-outlined text-[14px] transition-colors ${
                data.bgNight ? 'text-indigo-400' : 'text-slate-700'
              }`}
              title={data.bgNight ? `Night: ${data.bgNight}` : 'No Night Background'}
            >
              dark_mode
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 font-mono">
          <span className="material-symbols-outlined text-[13px] text-purple-400">
            inventory_2
          </span>
          <span className={objectsCount > 0 ? 'text-purple-300 font-bold' : 'text-slate-600'}>
            {objectsCount}
          </span>
        </div>
      </div>
    </div>
  )
})

WorldNode.displayName = 'WorldNode'

export default WorldNode

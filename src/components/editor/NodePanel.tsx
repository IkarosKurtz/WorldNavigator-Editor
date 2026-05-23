import type { Node } from '@xyflow/react'
import { useState } from 'react'
import type { NodeData } from '../types'

interface Props {
  node: Node<NodeData>
  onClose: () => void
  onChange: (id: string, field: keyof NodeData, value: string | boolean | string[]) => void
}

const bgFields: { key: keyof NodeData; label: string }[] = [
  { key: 'bgDay',       label: 'Day BG'       },
  { key: 'bgAfternoon', label: 'Afternoon BG'  },
  { key: 'bgNight',     label: 'Night BG'      },
]

export default function NodePanel({ node, onClose, onChange }: Props) {
  const data = node.data
  const [newObj, setNewObj] = useState('')

  const update = (field: keyof NodeData, value: string | boolean | string[]) => {
    onChange(node.id, field, value)
  }

  const handleAddObject = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newObj.trim()
    if (!trimmed) return
    const currentObjects = data.objects ?? []
    if (currentObjects.includes(trimmed)) return
    update('objects', [...currentObjects, trimmed])
    setNewObj('')
  }

  const handleRemoveObject = (indexToRemove: number) => {
    const currentObjects = data.objects ?? []
    update('objects', currentObjects.filter((_, i) => i !== indexToRemove))
  }

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(360px); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
      `}</style>
      <aside
        className="absolute right-4 top-4 bottom-4 w-90 z-50 glass-panel rounded-2xl flex flex-col shadow-2xl overflow-hidden font-sans border border-slate-800/80 animate-[slideInRight_0.25s_ease-out_forwards]"
        style={{ maxHeight: 'calc(100vh - 32px)' }}
      >
        <div className="p-5 border-b border-slate-800/80 flex items-start justify-between bg-slate-950/40">
          <div>
            <h2 className="font-serif text-xl font-medium text-white tracking-wide">
              Node Configuration
            </h2>
            <p className="font-mono text-[10px] text-slate-500 mt-1 uppercase tracking-widest bg-slate-900 px-1.5 py-0.5 rounded inline-block">
              ID: {node.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-880 p-1.5 rounded-full transition-all duration-150 flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Location Name
            </label>
            <input
              type="text"
              value={data.label}
              onChange={(e) => update('label', e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 transition-all font-sans"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Description
            </label>
            <textarea
              value={data.description ?? ''}
              onChange={(e) => update('description', e.target.value)}
              rows={3}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 transition-all font-sans resize-none"
            />
          </div>

          <hr className="border-t border-slate-800/80" />

          <div className="space-y-2">
            <label className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Location Type
            </label>
            <div className="flex gap-2.5">
              {(['exterior', 'interior'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => update('locationType', t)}
                  className={`flex-1 py-2 px-3 border text-xs font-bold tracking-wider uppercase rounded-lg transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${
                    data.locationType === t
                      ? 'border-blue-500/50 bg-blue-500/10 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                      : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {t === 'interior' ? 'meeting_room' : 'forest'}
                  </span>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/30 border border-slate-800/60 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-slate-400 text-[18px]">
                integration_instructions
              </span>
              <div>
                <span className="block text-xs font-semibold text-white">Python/Ren'Py Assets</span>
                <span className="block text-[10px] text-slate-500">Enable custom backgrounds</span>
              </div>
            </div>
            <button
              onClick={() => update('renPyEnabled', !data.renPyEnabled)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${
                data.renPyEnabled ? 'bg-blue-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 transform ${
                  data.renPyEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {data.renPyEnabled && (
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-1.5 border-b border-slate-800/80 pb-2 mb-1">
                <span className="material-symbols-outlined text-[14px] text-blue-400">imagesmode</span>
                <span className="text-[9px] font-bold tracking-wider uppercase text-blue-400">
                  Background Assets
                </span>
              </div>
              {bgFields.map(({ key, label }) => (
                <div key={key} className="space-y-1">
                  <label className="block text-[10px] font-semibold text-slate-400">{label}</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-2.5 bg-slate-950 border border-slate-800 border-r-0 text-slate-500 font-mono text-xs rounded-l-lg select-none">
                      bg
                    </span>
                    <input
                      type="text"
                      value={(data[key] as string) ?? ''}
                      onChange={(e) => update(key, e.target.value)}
                      placeholder="e.g. school_hall"
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-r-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500/80 font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <hr className="border-t border-slate-800/80" />

          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-purple-400 text-[18px]">inventory_2</span>
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Location Objects
                </span>
              </div>
              <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-[10px] px-1.5 py-0.5 rounded font-bold">
                {(data.objects ?? []).length}
              </span>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {(data.objects ?? []).length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2 text-center bg-slate-950/20 rounded-lg border border-dashed border-slate-800/50">
                  No objects in this location
                </p>
              ) : (
                (data.objects ?? []).map((obj, i) => (
                  <div
                    key={obj + i}
                    className="flex items-center justify-between bg-slate-950/40 border border-slate-800/80 rounded-lg p-2 group hover:border-slate-700/80 transition-colors"
                  >
                    <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      {obj}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveObject(i)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">delete</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddObject} className="flex gap-2">
              <input
                type="text"
                placeholder="New object (e.g. rusty_key)"
                value={newObj}
                onChange={(e) => setNewObj(e.target.value)}
                className="flex-1 bg-slate-950/60 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/80 font-mono"
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer select-none"
              >
                <span className="material-symbols-outlined text-[14px]">add</span>
                Add
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  )
}

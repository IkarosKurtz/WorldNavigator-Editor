import { useCallback, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
  type NodeMouseHandler,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { nodeTypes, edgeTypes, initialNodes, initialEdges } from './editor/constants'
import { type NodeData, type EdgeData } from './editor/types'
import NodePanel from './editor/NodePanel'
import EdgeContextMenu from './editor/EdgeContextMenu'
import ClearConfirmModal from './editor/ClearConfirmModal'
import Toolbar from './editor/Toolbar'
import {
  useOnConnect,
  useAddNode,
  useHandleNodeChange,
  useDeleteEdge,
  useToggleBidirectional,
  useImportWorld,
  useExportWorld,
  useClearAll,
} from './editor/hooks/useEditorActions'

const generateWorldJson = (nodes: Node<NodeData>[], edges: Edge[], worldName: string) => {
  const connections: Record<string, Array<string | { name: string; one_way: boolean }>> = {}
  nodes.forEach((n) => { connections[n.id] = [] })

  edges.forEach((edge) => {
    const isBi = (edge.data as EdgeData)?.bidirectional ?? true
    const srcNode = nodes.find((n) => n.id === edge.source)
    const tgtNode = nodes.find((n) => n.id === edge.target)
    if (!srcNode || !tgtNode) return

    if (isBi) {
      connections[edge.source].push(tgtNode.data.label)
      connections[edge.target].push(srcNode.data.label)
    } else {
      connections[edge.source].push({ name: tgtNode.data.label, one_way: true })
    }
  })

  return {
    name: worldName,
    locations: nodes.map((n) => {
      const d = n.data
      const backgrounds: Record<string, string> = {}
      if (d.bgDay)       backgrounds.day       = d.bgDay
      if (d.bgAfternoon) backgrounds.afternoon  = d.bgAfternoon
      if (d.bgNight)     backgrounds.night      = d.bgNight
      if (!backgrounds.day) backgrounds.day = ''
      return {
        name:                d.label,
        is_indoor:           d.locationType === 'interior',
        description:         d.description ?? '',
        backgrounds,
        connected_locations: connections[n.id] ?? [],
        objects:             d.objects ?? [],
      }
    }),
  }
}

function EditorInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNodeId, setSelectedNodeId]   = useState<string | null>(null)
  const [edgeMenu, setEdgeMenu]               = useState<{ x: number; y: number; edgeId: string } | null>(null)
  const [worldName, setWorldName]             = useState('World Name')
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showJsonPreview, setShowJsonPreview] = useState(true)
  const [copied, setCopied] = useState(false)

  const { fitView } = useReactFlow()

  const onConnect           = useOnConnect(setEdges)
  const addNode             = useAddNode(setNodes, setSelectedNodeId)
  const handleNodeChange    = useHandleNodeChange(setNodes)
  const deleteEdge          = useDeleteEdge(setEdges)
  const toggleBidirectional = useToggleBidirectional(setEdges)
  const importWorld         = useImportWorld({ setNodes, setEdges, setSelectedNodeId, setWorldName })
  const exportWorld         = useExportWorld(nodes as Node<NodeData>[], edges, worldName)
  const clearAll            = useClearAll(
    { setNodes, setEdges, setSelectedNodeId, setWorldName },
    () => setShowClearConfirm(false),
  )

  const onNodeClick: NodeMouseHandler = useCallback((_e, node) => {
    setSelectedNodeId(node.id)
    setEdgeMenu(null)
    fitView({ nodes: [{ id: node.id }], duration: 400, padding: 0.6, maxZoom: 1.6 })
  }, [fitView])

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null)
    setEdgeMenu(null)
  }, [])

  const onEdgeContextMenu = useCallback((e: React.MouseEvent, edge: Edge) => {
    e.preventDefault()
    e.stopPropagation()
    setEdgeMenu({ x: e.clientX, y: e.clientY, edgeId: edge.id })
  }, [])

  const selectedNode = selectedNodeId
    ? (nodes.find((n) => n.id === selectedNodeId) as Node<NodeData> | undefined) ?? null
    : null

  const menuEdge = edgeMenu ? edges.find((e) => e.id === edgeMenu.edgeId) : null
  const worldJson = generateWorldJson(nodes as Node<NodeData>[], edges, worldName)
  
  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(worldJson, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full h-screen relative font-sans overflow-hidden bg-[#05080f]">
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-360px); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      <div className="absolute top-4 left-4 z-40 flex items-center gap-2.5 bg-slate-950/70 border border-slate-800/80 px-4 py-2 rounded-xl backdrop-blur-md shadow-2xl pointer-events-auto">
        <span className="material-symbols-outlined text-purple-400 text-[18px]">public</span>
        <input
          value={worldName}
          onChange={(e) => setWorldName(e.target.value)}
          className="font-serif text-base font-semibold text-white bg-transparent border-none outline-none w-36 focus:ring-1 focus:ring-purple-500/30 rounded px-1.5 py-0.5"
          placeholder="World Name"
        />
      </div>

      {showJsonPreview && (
        <aside
          className="absolute left-4 top-16 bottom-4 w-90 z-30 glass-panel rounded-2xl flex flex-col shadow-2xl overflow-hidden font-sans border border-slate-800/80 animate-[slideInLeft_0.25s_ease-out_forwards]"
          style={{ maxHeight: 'calc(100vh - 80px)' }}
        >
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-400 text-[18px]">code</span>
              <h2 className="font-serif text-sm font-semibold text-white tracking-wide">
                Live .world.json Schema
              </h2>
            </div>
            <button
              onClick={handleCopyJson}
              className="text-slate-400 hover:text-white hover:bg-slate-850 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all duration-150 flex items-center gap-1.5 border border-slate-800 select-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[13px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="flex-1 p-4 overflow-auto bg-slate-950/20 font-mono text-[10px] text-slate-400 leading-relaxed scrollbar-thin">
            <pre className="whitespace-pre-wrap select-all">{JSON.stringify(worldJson, null, 2)}</pre>
          </div>
        </aside>
      )}

      {selectedNode && (
        <NodePanel
          node={selectedNode}
          onClose={() => setSelectedNodeId(null)}
          onChange={handleNodeChange}
        />
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onEdgeContextMenu={onEdgeContextMenu}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: 'worldEdge', data: { bidirectional: true } }}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        style={{ background: '#05080f' }}
        deleteKeyCode="Delete"
        connectionRadius={30}
      >
        <Background variant={BackgroundVariant.Lines} gap={40} color="#111c2e" lineWidth={1} />
        <Controls
          position="bottom-left"
          showFitView
          showInteractive
          style={{
            boxShadow: 'none',
            border: '1px solid rgba(34, 55, 94, 0.6)',
            borderRadius: 12,
            background: 'rgba(13, 21, 39, 0.85)',
          }}
          className="p-1 [&_button]:!bg-transparent [&_button]:!border-none [&_button]:!text-slate-400 [&_button:hover]:!text-white [&_button]:!transition-all [&_button]:!w-7 [&_button]:!h-7"
        />
        <MiniMap
          position="bottom-right"
          nodeColor={(n) => {
            const data = n.data as NodeData
            return data.locationType === 'interior' ? '#1e1b4b' : '#062f4f'
          }}
          maskColor="rgba(15, 23, 42, 0.7)"
          style={{
            border: '1px solid rgba(34, 55, 94, 0.6)',
            borderRadius: 12,
            background: 'rgba(13, 21, 39, 0.85)',
          }}
        />
      </ReactFlow>

      {edgeMenu && menuEdge && (
        <EdgeContextMenu
          x={edgeMenu.x}
          y={edgeMenu.y}
          edgeId={edgeMenu.edgeId}
          isBidirectional={(menuEdge.data as EdgeData)?.bidirectional ?? false}
          onDelete={() => deleteEdge(edgeMenu.edgeId)}
          onToggleBi={() => toggleBidirectional(edgeMenu.edgeId)}
          onClose={() => setEdgeMenu(null)}
        />
      )}

      <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] z-0 select-none">
        <span className="font-serif text-[120px] font-bold text-white whitespace-nowrap">
          WorldNavigator
        </span>
      </div>

      {showClearConfirm && (
        <ClearConfirmModal onConfirm={clearAll} onCancel={() => setShowClearConfirm(false)} />
      )}

      <Toolbar
        onAddNode={addNode}
        onImport={importWorld}
        onClear={() => setShowClearConfirm(true)}
        onExport={exportWorld}
        showJsonPreview={showJsonPreview}
        onToggleJsonPreview={() => setShowJsonPreview(!showJsonPreview)}
      />

      {!selectedNode && !edgeMenu && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/70 border border-slate-800/80 px-4 py-2 rounded-xl backdrop-blur-md shadow-2xl pointer-events-none text-[10px] tracking-wide text-slate-400 font-sans text-center">
          <span className="text-purple-400 font-semibold">Tip:</span> Click location to edit · Drag handles to connect · Right-click connection for options · <kbd className="bg-slate-900 px-1 py-0.5 rounded border border-slate-800 text-slate-300 font-mono">Del</kbd> key removes selection
        </div>
      )}
    </div>
  )
}

export default function GraphEditor() {
  return (
    <ReactFlowProvider>
      <EditorInner />
    </ReactFlowProvider>
  )
}

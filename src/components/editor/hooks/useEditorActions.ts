import { useCallback } from 'react'
import { addEdge, MarkerType, useReactFlow, type Connection, type Edge, type Node } from '@xyflow/react'
import type { NodeData, EdgeData } from '../types'

interface Setters {
  setNodes: React.Dispatch<React.SetStateAction<Node<NodeData>[]>>
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
  setSelectedNodeId: (id: string | null) => void
  setWorldName: (name: string) => void
}

export function useOnConnect(setEdges: Setters['setEdges']) {
  return useCallback(
    (connection: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: 'worldEdge',
            data: { bidirectional: true },
            markerEnd:   { type: MarkerType.ArrowClosed, color: '#8b5cf6', width: 14, height: 14 },
            markerStart: { type: MarkerType.ArrowClosed, color: '#8b5cf6', width: 14, height: 14 },
          },
          eds,
        ),
      ),
    [setEdges],
  )
}

export function useAddNode(setNodes: Setters['setNodes'], setSelectedNodeId: Setters['setSelectedNodeId']) {
  const { fitView } = useReactFlow()

  return useCallback(() => {
    const id = `node-${Date.now()}`
    const newNode: Node<NodeData> = {
      id,
      type: 'worldNode',
      position: { x: Math.random() * 600 + 100, y: Math.random() * 400 + 100 },
      data: { label: 'New Location', locationType: 'exterior', description: '', bgDay: '', bgAfternoon: '', bgNight: '', renPyEnabled: false, objects: [] },
    }
    setNodes((nds) => [...nds, newNode])
    setTimeout(() => {
      fitView({ nodes: [{ id }], duration: 400, padding: 0.6, maxZoom: 1.6 })
      setSelectedNodeId(id)
    }, 50)
  }, [setNodes, setSelectedNodeId, fitView])
}

export function useHandleNodeChange(setNodes: Setters['setNodes']) {
  return useCallback(
    (id: string, field: keyof NodeData, value: string | boolean | string[]) =>
      setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, [field]: value } } : n))),
    [setNodes],
  )
}

export function useDeleteEdge(setEdges: Setters['setEdges']) {
  return useCallback(
    (id: string) => setEdges((eds) => eds.filter((e) => e.id !== id)),
    [setEdges],
  )
}

export function useToggleBidirectional(setEdges: Setters['setEdges']) {
  return useCallback(
    (id: string) =>
      setEdges((eds) =>
        eds.map((e) => {
          if (e.id !== id) return e
          const newBi = !((e.data as EdgeData)?.bidirectional ?? false)
          return {
            ...e,
            data: { ...e.data, bidirectional: newBi },
            markerEnd:   { type: MarkerType.ArrowClosed, color: newBi ? '#8b5cf6' : '#3b82f6', width: 14, height: 14 },
            markerStart: newBi ? { type: MarkerType.ArrowClosed, color: '#8b5cf6', width: 14, height: 14 } : undefined,
          }
        }),
      ),
    [setEdges],
  )
}

export function useImportWorld(setters: Setters) {
  const { setNodes, setEdges, setSelectedNodeId, setWorldName } = setters
  const { fitView } = useReactFlow()

  return useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const json = JSON.parse(ev.target?.result as string)
          if (json.name) setWorldName(json.name)

          const locations: any[] = json.locations ?? []
          const cols = Math.ceil(Math.sqrt(locations.length))
          const GAP = 220

          const newNodes: Node<NodeData>[] = locations.map((loc, i) => ({
            id: loc.name,
            type: 'worldNode',
            position: { x: (i % cols) * GAP + 100, y: Math.floor(i / cols) * GAP + 100 },
            data: {
              label:        loc.name,
              locationType: loc.is_indoor ? 'interior' : 'exterior',
              description:  loc.description ?? '',
              bgDay:        loc.backgrounds?.day       ?? '',
              bgAfternoon:  loc.backgrounds?.afternoon ?? '',
              bgNight:      loc.backgrounds?.night     ?? '',
              renPyEnabled: !!(loc.backgrounds?.day || loc.backgrounds?.afternoon || loc.backgrounds?.night),
              objects:      loc.objects                ?? [],
            },
          }))

          const newEdges: Edge[] = []
          const seen = new Set<string>()

          locations.forEach((loc) => {
            const srcId = loc.name
            ;(loc.connected_locations ?? []).forEach((conn: any) => {
              const isOneWay = typeof conn === 'object' && conn.one_way === true
              const tgtId = typeof conn === 'string' ? conn : conn.name
              if (!locations.find((l) => l.name === tgtId)) return

              if (isOneWay) {
                const edgeId = `e-${srcId}-${tgtId}`
                if (!seen.has(edgeId)) {
                  seen.add(edgeId)
                  newEdges.push({
                    id: edgeId, type: 'worldEdge', source: srcId, target: tgtId, data: { bidirectional: false },
                    markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6', width: 14, height: 14 }
                  })
                }
              } else {
                const key = [srcId, tgtId].sort().join('::')
                if (!seen.has(key)) {
                  seen.add(key)
                  newEdges.push({
                    id: `e-${key}`, type: 'worldEdge', source: srcId, target: tgtId, data: { bidirectional: true },
                    markerEnd:   { type: MarkerType.ArrowClosed, color: '#8b5cf6', width: 14, height: 14 },
                    markerStart: { type: MarkerType.ArrowClosed, color: '#8b5cf6', width: 14, height: 14 },
                  })
                }
              }
            })
          })

          setNodes(newNodes)
          setEdges(newEdges)
          setSelectedNodeId(null)
          setTimeout(() => fitView({ duration: 500, padding: 0.2 }), 50)
        } catch {
          alert('Invalid .world.json file')
        }
      }
      reader.readAsText(file)
      e.target.value = ''
    },
    [setNodes, setEdges, setSelectedNodeId, setWorldName, fitView],
  )
}

export function useExportWorld(nodes: Node<NodeData>[], edges: Edge[], worldName: string) {
  return useCallback(() => {
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

    const world = {
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
          objects:             d.objects                ?? [],
        }
      }),
    }

    const blob = new Blob([JSON.stringify(world, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${worldName.toLowerCase().replace(/\s+/g, '_')}.world.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [nodes, edges, worldName])
}

export function useClearAll(setters: Setters, onDone: () => void) {
  const { setNodes, setEdges, setSelectedNodeId, setWorldName } = setters
  return useCallback(() => {
    setNodes([])
    setEdges([])
    setSelectedNodeId(null)
    setWorldName('World Name')
    onDone()
  }, [setNodes, setEdges, setSelectedNodeId, setWorldName, onDone])
}

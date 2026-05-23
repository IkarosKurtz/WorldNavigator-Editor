import { MarkerType, type Edge, type Node } from '@xyflow/react'
import WorldNode from '../WorldNode'
import WorldEdge from './WorldEdge'
import type { NodeData } from './types'

export const nodeTypes = { worldNode: WorldNode }
export const edgeTypes = { worldEdge: WorldEdge }

export const initialNodes: Node<NodeData>[] = [
  {
    id: 'forest-edge',
    type: 'worldNode',
    position: { x: 200, y: 260 },
    data: {
      label: 'Forest Edge',
      locationType: 'exterior',
      description: 'The edge of the ancient forest, where the treeline meets open plains.',
      bgDay: 'forest_edge_day',
      bgAfternoon: 'forest_edge_sunset',
      bgNight: 'forest_edge_night',
      renPyEnabled: true,
    },
  },
  {
    id: 'sunlit-clearing',
    type: 'worldNode',
    position: { x: 500, y: 260 },
    data: {
      label: 'Sunlit Clearing',
      locationType: 'exterior',
      description: 'A bright clearing bathed in warm sunlight.',
      bgDay: 'clearing_day',
      bgAfternoon: 'clearing_sunset',
      bgNight: 'clearing_night',
      renPyEnabled: true,
    },
  },
  {
    id: 'dark-cave',
    type: 'worldNode',
    position: { x: 800, y: 100 },
    data: {
      label: 'Dark Cave',
      locationType: 'interior',
      description: 'A deep cave shrouded in darkness. Dripping water echoes from within.',
      bgDay: 'cave_interior',
      bgAfternoon: 'cave_interior',
      bgNight: 'cave_interior_night',
      renPyEnabled: false,
    },
  },
  {
    id: 'rushing-river',
    type: 'worldNode',
    position: { x: 800, y: 420 },
    data: {
      label: 'Rushing River',
      locationType: 'exterior',
      description: 'A fast-flowing river cutting through the landscape.',
      bgDay: 'river_day',
      bgAfternoon: 'river_sunset',
      bgNight: 'river_night',
      renPyEnabled: true,
    },
  },
]

const biMarkers = {
  markerEnd: { type: MarkerType.ArrowClosed, color: '#7c3aed', width: 14, height: 14 },
  markerStart: { type: MarkerType.ArrowClosed, color: '#7c3aed', width: 14, height: 14 },
}

export const initialEdges: Edge[] = [
  { id: 'e1-2', type: 'worldEdge', source: 'forest-edge',     target: 'sunlit-clearing', data: { bidirectional: true }, ...biMarkers },
  { id: 'e2-3', type: 'worldEdge', source: 'sunlit-clearing', target: 'dark-cave',        data: { bidirectional: true }, ...biMarkers },
  { id: 'e2-4', type: 'worldEdge', source: 'sunlit-clearing', target: 'rushing-river',    data: { bidirectional: true }, ...biMarkers },
]

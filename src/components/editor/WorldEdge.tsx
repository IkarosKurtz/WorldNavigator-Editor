import { getBezierPath, type EdgeProps } from '@xyflow/react'
import type { EdgeData } from './types'

export default function WorldEdge({
  id,
  sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  data, selected,
  markerEnd, markerStart,
}: EdgeProps) {
  const isBi = (data as EdgeData)?.bidirectional ?? false
  
  const color = isBi ? '#8b5cf6' : '#3b82f6'
  const glowColor = isBi ? 'rgba(139, 92, 246, 0.25)' : 'rgba(59, 130, 246, 0.25)'
  const strokeWidth = selected ? 3.5 : 2

  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })

  return (
    <>
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={{ cursor: 'pointer' }}
      />
      
      <path
        d={edgePath}
        fill="none"
        stroke={glowColor}
        strokeWidth={strokeWidth + 5}
        style={{
          transition: 'stroke 0.2s, stroke-width 0.2s',
          filter: 'blur(3px)',
        }}
      />
      
      <path
        d={edgePath}
        fill="none"
        stroke={selected ? (isBi ? '#a78bfa' : '#60a5fa') : color}
        strokeWidth={strokeWidth}
        markerEnd={markerEnd}
        markerStart={markerStart}
        style={{
          transition: 'stroke 0.2s, stroke-width 0.2s',
        }}
      />

      <path
        d={edgePath}
        fill="none"
        stroke="#ffffff"
        strokeWidth={0.8}
        style={{
          opacity: selected ? 0.8 : 0.45,
          transition: 'opacity 0.2s',
          pointerEvents: 'none',
        }}
      />
    </>
  )
}

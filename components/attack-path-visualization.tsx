'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

interface Node {
  id: string
  type: 'asset' | 'vulnerability' | 'attack' | 'impact'
  label: string
  details: Record<string, any>
  risk: number
  x?: number
  y?: number
}

interface Edge {
  source: string | Node
  target: string | Node
  probability: number
  type: 'exploit' | 'lateral_movement' | 'privilege_escalation'
}

interface AttackPath {
  nodes: Node[]
  edges: Edge[]
}

const NODE_COLORS = {
  asset: '#60a5fa',        // blue
  vulnerability: '#f87171', // red
  attack: '#fbbf24',       // yellow
  impact: '#4ade80'        // green
}

const EDGE_COLORS = {
  exploit: '#ef4444',             // red
  lateral_movement: '#f59e0b',    // orange
  privilege_escalation: '#8b5cf6'  // purple
}

export default function AttackPathVisualization() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [data, setData] = useState<AttackPath | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/attack-paths')
        if (!response.ok) {
          throw new Error('Failed to fetch attack paths')
        }
        const jsonData = await response.json()
        setData(jsonData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!data || !svgRef.current) return

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove()

    // Set up SVG
    const width = 800
    const height = 600
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)

    // Create arrow marker for edges
    svg.append('defs').selectAll('marker')
      .data(['end'])
      .join('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 15)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#999')

    // Create force simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.edges)
        .id((d: any) => d.id)
        .distance(100))
      .force('charge', d3.forceManyBody().strength(-1000))
      .force('center', d3.forceCenter(width / 2, height / 2))

    // Create container for zoom/pan
    const container = svg.append('g')

    // Add zoom behavior
    svg.call(d3.zoom()
      .extent([[0, 0], [width, height]])
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        container.attr('transform', event.transform)
      }))

    // Create edges
    const edges = container.append('g')
      .selectAll('line')
      .data(data.edges)
      .join('line')
      .attr('stroke', d => EDGE_COLORS[d.type])
      .attr('stroke-width', d => d.probability * 3)
      .attr('marker-end', 'url(#arrow)')
      .attr('opacity', 0.6)

    // Create nodes
    const nodes = container.append('g')
      .selectAll('circle')
      .data(data.nodes)
      .join('circle')
      .attr('r', 20)
      .attr('fill', d => NODE_COLORS[d.type])
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('click', (event, d) => {
        event.stopPropagation()
        setSelectedNode(d)
      })

    // Add labels
    const labels = container.append('g')
      .selectAll('text')
      .data(data.nodes)
      .join('text')
      .text(d => d.label)
      .attr('font-size', '12px')
      .attr('text-anchor', 'middle')
      .attr('dy', 30)

    // Update positions on simulation tick
    simulation.on('tick', () => {
      edges
        .attr('x1', d => (d.source as Node).x!)
        .attr('y1', d => (d.source as Node).y!)
        .attr('x2', d => (d.target as Node).x!)
        .attr('y2', d => (d.target as Node).y!)

      nodes
        .attr('cx', d => d.x!)
        .attr('cy', d => d.y!)

      labels
        .attr('x', d => d.x!)
        .attr('y', d => d.y!)
    })

    // Drag functions
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      event.subject.fx = event.subject.x
      event.subject.fy = event.subject.y
    }

    function dragged(event: any) {
      event.subject.fx = event.x
      event.subject.fy = event.y
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0)
      event.subject.fx = null
      event.subject.fy = null
    }

    // Cleanup
    return () => {
      simulation.stop()
    }
  }, [data])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attack Path Analysis</CardTitle>
          <CardDescription>Visualizing potential attack vectors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attack Path Analysis</CardTitle>
          <CardDescription>Visualizing potential attack vectors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Error: {error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attack Path Analysis</CardTitle>
        <CardDescription>Visualizing potential attack vectors</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-gray-50">
            <svg ref={svgRef} className="w-full h-[600px]" />
          </div>

          {selectedNode && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">{selectedNode.label}</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 w-24">Type:</span>
                  <span className="text-sm font-medium">{selectedNode.type}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 w-24">Risk Score:</span>
                  <span className="text-sm font-medium">{(selectedNode.risk * 100).toFixed(1)}%</span>
                </div>
                {Object.entries(selectedNode.details).map(([key, value]) => (
                  <div key={key} className="flex items-start">
                    <span className="text-sm text-gray-600 w-24">{key}:</span>
                    <span className="text-sm font-medium">
                      {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Node Types</h4>
              <div className="space-y-2">
                {Object.entries(NODE_COLORS).map(([type, color]) => (
                  <div key={type} className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm capitalize">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Edge Types</h4>
              <div className="space-y-2">
                {Object.entries(EDGE_COLORS).map(([type, color]) => (
                  <div key={type} className="flex items-center">
                    <div
                      className="w-4 h-4 rounded mr-2"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

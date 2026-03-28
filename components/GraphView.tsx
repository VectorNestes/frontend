"use client";

import { useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  NodeTypes,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { useAppStore } from "@/store/useAppStore";
import CustomNode from "./CustomNode";
import NodeDetails from "./NodeDetails";
import { GraphNode } from "@/lib/mockData";

const nodeTypes: NodeTypes = { customNode: CustomNode };

export default function GraphView() {
  const { nodes: storeNodes, edges: storeEdges, setSelectedNode } = useAppStore();
  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges);

  useEffect(() => { setNodes(storeNodes); }, [storeNodes, setNodes]);
  useEffect(() => { setEdges(storeEdges); }, [storeEdges, setEdges]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.data as GraphNode);
  }, [setSelectedNode]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  return (
    <div className="relative w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{ type: "smoothstep" }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#27272A"
        />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(n) => {
            const d = n.data as GraphNode;
            if (d.isCrownJewel) return "#DC2626";
            if (d.type === "serviceaccount") return "#7C3AED";
            if (d.type === "role") return "#D97706";
            return "#3F3F46";
          }}
          maskColor="rgba(11,11,12,0.85)"
        />
      </ReactFlow>

      {/* Legend */}
      <div className="absolute top-4 right-4 card p-3 text-xs space-y-2 shadow-md z-10">
        <p className="section-label mb-2">Node types</p>
        {[
          { dot: "bg-ink-tertiary",  label: "Pod / Internet" },
          { dot: "bg-violet",        label: "Service account" },
          { dot: "bg-amber",         label: "Role" },
          { dot: "bg-danger",        label: "Secret / Crown jewel" },
        ].map(({ dot, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${dot} shrink-0`} />
            <span className="text-ink-tertiary">{label}</span>
          </div>
        ))}
      </div>

      {/* Node count */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-elevated border border-border shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-success" />
          <span className="text-xs text-ink-secondary font-mono">
            {nodes.length} nodes · {edges.length} edges
          </span>
        </div>
      </div>

      <NodeDetails />
    </div>
  );
}

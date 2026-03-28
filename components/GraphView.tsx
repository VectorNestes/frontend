"use client";

import { useCallback, useEffect, useMemo } from "react";
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

const nodeTypes: NodeTypes = { customNode: CustomNode };

export default function GraphView() {
  const {
    graphData,
    selectedNodeId,
    setSelectedNodeId,
    vulnerabilities,
    activeView,
  } = useAppStore();

  // Augment node data with vulnerability info and risk scores
  const augmentedNodes = useMemo(() => {
    const vulnMap = new Map(vulnerabilities.map((v) => [v.nodeId, v]));
    const showRisk = activeView === "vulnerabilities";

    return graphData.nodes.map((n) => {
      const vuln = vulnMap.get(n.id);
      return {
        ...n,
        selected: n.id === selectedNodeId,
        data: {
          ...n.data,
          hasVulnerability: !!vuln,
          riskScore: showRisk ? vuln?.riskScore : undefined,
        },
      };
    });
  }, [graphData.nodes, vulnerabilities, activeView, selectedNodeId]);

  const [nodes, setNodes, onNodesChange] = useNodesState(augmentedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graphData.edges);

  useEffect(() => {
    setNodes(augmentedNodes);
  }, [augmentedNodes, setNodes]);

  useEffect(() => {
    setEdges(graphData.edges);
  }, [graphData.edges, setEdges]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  if (graphData.nodes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-canvas">
        <div className="text-center">
          <p className="text-sm text-ink-tertiary">No cluster data loaded.</p>
          <p className="text-xs text-ink-disabled mt-1">
            Run the CLI ingestion command to populate the graph.
          </p>
        </div>
      </div>
    );
  }

  return (
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
      minZoom={0.2}
      maxZoom={2.5}
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
          const t = n.data?.apiNode?.type;
          if (t === "secret") return "#DC2626";
          if (t === "serviceaccount") return "#7C3AED";
          if (t === "role") return "#D97706";
          return "#3F3F46";
        }}
        maskColor="rgba(11,11,12,0.85)"
      />
    </ReactFlow>
  );
}

import { create } from "zustand";
import { Node, Edge, MarkerType } from "reactflow";
import Dagre from "@dagrejs/dagre";
import type {
  Vulnerability,
  AttackPath,
  CriticalNode,
  SimulationResult,
  ApiNode,
  ApiEdge,
} from "@/lib/types";

export type ActiveView =
  | "overview"
  | "paths"
  | "vulnerabilities"
  | "critical"
  | "report";

const NODE_W = 160;
const NODE_H = 60;

function defaultEdgeStyle() {
  return {
    animated: false,
    style: { stroke: "rgba(63,63,70,0.8)", strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(63,63,70,0.8)" },
  };
}

function runDagre(
  apiNodes: ApiNode[],
  apiEdges: ApiEdge[]
): { nodes: Node[]; edges: Edge[] } {
  const g = new Dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: "LR",
    nodesep: 60,
    ranksep: 120,
    marginx: 40,
    marginy: 40,
  });

  apiNodes.forEach((n) => g.setNode(n.id, { width: NODE_W, height: NODE_H }));
  apiEdges.forEach((e) => {
    if (g.hasNode(e.source) && g.hasNode(e.target)) {
      g.setEdge(e.source, e.target);
    }
  });

  Dagre.layout(g);

  const nodes: Node[] = apiNodes.map((n) => {
    const pos = g.node(n.id) ?? { x: 0, y: 0 };
    return {
      id: n.id,
      type: "customNode",
      position: { x: pos.x - NODE_W / 2, y: pos.y - NODE_H / 2 },
      data: {
        apiNode: n,
        highlighted: false,
        dimmed: false,
        isCritical: false,
      },
    };
  });

  const edges: Edge[] = apiEdges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: "smoothstep",
    ...defaultEdgeStyle(),
  }));

  return { nodes, edges };
}

interface AppState {
  // Auth (used by login/signup/settings)
  user: { name: string; email: string } | null;
  setUser: (user: { name: string; email: string } | null) => void;

  graphData: { nodes: Node[]; edges: Edge[] };
  _rawNodes: ApiNode[];
  _rawEdges: ApiEdge[];

  selectedNodeId: string | null;
  activePaths: AttackPath[];
  selectedPathIndex: number | null;
  vulnerabilities: Vulnerability[];
  criticalNode: CriticalNode | null;
  simulationResult: SimulationResult | null;
  activeView: ActiveView;
  report: string;
  loading: Record<string, boolean>;
  errors: Record<string, string>;

  setActiveView: (view: ActiveView) => void;
  setSelectedNodeId: (id: string | null) => void;
  loadGraph: (nodes: ApiNode[], edges: ApiEdge[]) => void;
  setVulnerabilities: (v: Vulnerability[]) => void;
  setActivePaths: (p: AttackPath[]) => void;
  setCriticalNode: (n: CriticalNode | null) => void;
  setSimulationResult: (r: SimulationResult | null) => void;
  setReport: (r: string) => void;
  setLoading: (key: string, v: boolean) => void;
  setError: (key: string, msg: string) => void;
  clearError: (key: string) => void;
  highlightPath: (index: number | null) => void;
  highlightCritical: (nodeId: string | null) => void;
  resetGraphStyles: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),

  graphData: { nodes: [], edges: [] },
  _rawNodes: [],
  _rawEdges: [],
  selectedNodeId: null,
  activePaths: [],
  selectedPathIndex: null,
  vulnerabilities: [],
  criticalNode: null,
  simulationResult: null,
  activeView: "overview",
  report: "",
  loading: {},
  errors: {},

  setActiveView: (view) => {
    // Reset styles when switching views
    const { graphData } = get();
    set({
      activeView: view,
      selectedNodeId: null,
      selectedPathIndex: null,
      simulationResult: null,
      graphData: {
        nodes: graphData.nodes.map((n) => ({
          ...n,
          data: { ...n.data, highlighted: false, dimmed: false, isCritical: false },
        })),
        edges: graphData.edges.map((e) => ({
          ...e,
          ...defaultEdgeStyle(),
        })),
      },
    });
  },

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  loadGraph: (apiNodes, apiEdges) => {
    console.log("[store] loadGraph", apiNodes.length, "nodes,", apiEdges.length, "edges");
    const { nodes, edges } = runDagre(apiNodes, apiEdges);
    set({ graphData: { nodes, edges }, _rawNodes: apiNodes, _rawEdges: apiEdges });
  },

  setVulnerabilities: (v) => set({ vulnerabilities: v }),
  setActivePaths: (p) => set({ activePaths: p }),
  setCriticalNode: (n) => set({ criticalNode: n }),
  setSimulationResult: (r) => set({ simulationResult: r }),
  setReport: (r) => set({ report: r }),

  setLoading: (key, v) =>
    set((s) => ({ loading: { ...s.loading, [key]: v } })),

  setError: (key, msg) =>
    set((s) => ({ errors: { ...s.errors, [key]: msg } })),

  clearError: (key) =>
    set((s) => {
      const next = { ...s.errors };
      delete next[key];
      return { errors: next };
    }),

  highlightPath: (index) => {
    const { activePaths, graphData } = get();
    if (index === null) {
      set({
        selectedPathIndex: null,
        graphData: {
          nodes: graphData.nodes.map((n) => ({
            ...n,
            data: { ...n.data, highlighted: false, dimmed: false },
          })),
          edges: graphData.edges.map((e) => ({ ...e, ...defaultEdgeStyle() })),
        },
      });
      return;
    }
    const path = activePaths[index];
    if (!path) return;
    const pathSet = new Set(path.nodes);
    set({
      selectedPathIndex: index,
      graphData: {
        nodes: graphData.nodes.map((n) => ({
          ...n,
          data: {
            ...n.data,
            highlighted: pathSet.has(n.id),
            dimmed: !pathSet.has(n.id),
          },
        })),
        edges: graphData.edges.map((e) => {
          const on = pathSet.has(e.source) && pathSet.has(e.target);
          return {
            ...e,
            animated: on,
            style: on
              ? { stroke: "#DC2626", strokeWidth: 2 }
              : { stroke: "rgba(63,63,70,0.2)", strokeWidth: 1 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: on ? "#DC2626" : "rgba(63,63,70,0.2)",
            },
          };
        }),
      },
    });
  },

  highlightCritical: (nodeId) => {
    const { graphData } = get();
    set({
      graphData: {
        ...graphData,
        nodes: graphData.nodes.map((n) => ({
          ...n,
          data: { ...n.data, isCritical: n.id === nodeId },
        })),
      },
    });
  },

  resetGraphStyles: () => {
    const { graphData } = get();
    set({
      graphData: {
        nodes: graphData.nodes.map((n) => ({
          ...n,
          data: { ...n.data, highlighted: false, dimmed: false, isCritical: false },
        })),
        edges: graphData.edges.map((e) => ({ ...e, ...defaultEdgeStyle() })),
      },
    });
  },
}));

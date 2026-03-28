import { create } from "zustand";
import { Node, Edge } from "reactflow";
import {
  GraphNode,
  AttackPath,
  getFlowNodes,
  getFlowEdges,
  mockAttackPaths,
} from "@/lib/mockData";

interface AppState {
  // Auth
  user: { name: string; email: string } | null;
  isAuthenticated: boolean;
  setUser: (user: { name: string; email: string } | null) => void;

  // Graph
  nodes: Node[];
  edges: Edge[];
  selectedNode: GraphNode | null;
  isNodePanelOpen: boolean;
  highlightedPath: string[] | null;
  setSelectedNode: (node: GraphNode | null) => void;
  setNodePanelOpen: (open: boolean) => void;
  setHighlightedPath: (path: string[] | null) => void;
  refreshGraph: (path?: string[]) => void;

  // Attack Paths
  attackPaths: AttackPath[];
  selectedPath: AttackPath | null;
  setSelectedPath: (path: AttackPath | null) => void;

  // Scan
  isScanning: boolean;
  scanComplete: boolean;
  scanLogs: Array<{ text: string; type: string; timestamp: string }>;
  useMockMode: boolean;
  setScanning: (v: boolean) => void;
  setScanComplete: (v: boolean) => void;
  addScanLog: (log: { text: string; type: string }) => void;
  clearScanLogs: () => void;
  setMockMode: (v: boolean) => void;

  // UI
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  setUser: (user) =>
    set({ user, isAuthenticated: !!user }),

  // Graph
  nodes: getFlowNodes(),
  edges: getFlowEdges(),
  selectedNode: null,
  isNodePanelOpen: false,
  highlightedPath: null,

  setSelectedNode: (node) =>
    set({ selectedNode: node, isNodePanelOpen: !!node }),

  setNodePanelOpen: (open) =>
    set({ isNodePanelOpen: open, selectedNode: open ? get().selectedNode : null }),

  setHighlightedPath: (path) => {
    set({
      highlightedPath: path,
      nodes: getFlowNodes(path ?? undefined),
      edges: getFlowEdges(path ?? undefined),
    });
  },

  refreshGraph: (path) => {
    set({
      nodes: getFlowNodes(path),
      edges: getFlowEdges(path),
    });
  },

  // Attack Paths
  attackPaths: mockAttackPaths,
  selectedPath: null,
  setSelectedPath: (path) => {
    set({ selectedPath: path });
    if (path) {
      get().setHighlightedPath(path.nodes);
    } else {
      get().setHighlightedPath(null);
    }
  },

  // Scan
  isScanning: false,
  scanComplete: false,
  scanLogs: [],
  useMockMode: true,

  setScanning: (v) => set({ isScanning: v }),
  setScanComplete: (v) => set({ scanComplete: v }),
  addScanLog: (log) =>
    set((state) => ({
      scanLogs: [
        ...state.scanLogs,
        {
          ...log,
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        },
      ],
    })),
  clearScanLogs: () => set({ scanLogs: [], scanComplete: false }),
  setMockMode: (v) => set({ useMockMode: v }),

  // UI
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));

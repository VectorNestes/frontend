export interface ApiNode {
  id: string;
  type: string;
  label?: string;
}

export interface ApiEdge {
  id: string;
  source: string;
  target: string;
}

export interface GraphData {
  nodes: ApiNode[];
  edges: ApiEdge[];
}

export interface Vulnerability {
  nodeId: string;
  type: string;
  riskScore: number;
  cves: string[];
  reason: string;
}

export interface AttackPath {
  id: string;
  nodes: string[];
  riskScore: number;
  description: string;
}

export interface CriticalNode {
  nodeId: string;
  score: number;
  pathsEliminated: number;
}

export interface SimulationResult {
  before: number;
  after: number;
  impact: number;
}

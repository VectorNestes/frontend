import { Node, Edge, MarkerType } from "reactflow";

export interface GraphNode {
  id: string;
  type: "pod" | "serviceaccount" | "role" | "secret" | "internet" | "namespace";
  label: string;
  riskScore: number;
  riskLevel: "critical" | "high" | "medium" | "low";
  isCrownJewel?: boolean;
  isEntryPoint?: boolean;
  namespace?: string;
  permissions?: string[];
  cves?: CVE[];
  description?: string;
}

export interface CVE {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  cvss: number;
}

export interface AttackPath {
  id: string;
  name: string;
  severity: "critical" | "high" | "medium";
  nodes: string[];
  description: string;
  steps: string[];
}

export const mockCVEs: Record<string, CVE[]> = {
  "pod-webapp": [
    {
      id: "CVE-2023-44487",
      severity: "high",
      description: "HTTP/2 Rapid Reset Attack",
      cvss: 7.5,
    },
    {
      id: "CVE-2024-21626",
      severity: "critical",
      description: "runc container escape vulnerability",
      cvss: 9.8,
    },
  ],
  "pod-api": [
    {
      id: "CVE-2023-38545",
      severity: "critical",
      description: "curl SOCKS5 heap buffer overflow",
      cvss: 9.8,
    },
  ],
  "pod-database": [
    {
      id: "CVE-2024-0553",
      severity: "medium",
      description: "GnuTLS timing side-channel",
      cvss: 5.9,
    },
  ],
};

export const mockGraphNodes: GraphNode[] = [
  {
    id: "internet",
    type: "internet",
    label: "Internet",
    riskScore: 0,
    riskLevel: "low",
    isEntryPoint: true,
    description: "External internet access point",
    permissions: [],
    cves: [],
  },
  {
    id: "pod-webapp",
    type: "pod",
    label: "webapp-pod",
    riskScore: 87,
    riskLevel: "critical",
    isEntryPoint: true,
    namespace: "default",
    description: "Frontend web application pod exposed to internet",
    permissions: ["list:pods", "get:secrets"],
    cves: mockCVEs["pod-webapp"],
  },
  {
    id: "pod-api",
    type: "pod",
    label: "api-server-pod",
    riskScore: 72,
    riskLevel: "high",
    namespace: "default",
    description: "Backend API server with elevated privileges",
    permissions: ["create:pods", "delete:pods", "get:secrets", "list:nodes"],
    cves: mockCVEs["pod-api"],
  },
  {
    id: "sa-default",
    type: "serviceaccount",
    label: "default-sa",
    riskScore: 65,
    riskLevel: "high",
    namespace: "default",
    description: "Default service account with excessive permissions",
    permissions: ["*:*"],
    cves: [],
  },
  {
    id: "sa-admin",
    type: "serviceaccount",
    label: "cluster-admin-sa",
    riskScore: 95,
    riskLevel: "critical",
    namespace: "kube-system",
    description: "Service account with cluster-admin role binding — extremely dangerous",
    permissions: ["*:*:*"],
    cves: [],
  },
  {
    id: "role-clusteradmin",
    type: "role",
    label: "cluster-admin",
    riskScore: 100,
    riskLevel: "critical",
    description: "Cluster-wide admin role with all permissions",
    permissions: ["*:*:*"],
    cves: [],
  },
  {
    id: "role-podrw",
    type: "role",
    label: "pod-readwrite",
    riskScore: 55,
    riskLevel: "medium",
    namespace: "default",
    description: "Role allowing pod read/write operations",
    permissions: ["get:pods", "list:pods", "create:pods", "delete:pods"],
    cves: [],
  },
  {
    id: "secret-db",
    type: "secret",
    label: "db-credentials",
    riskScore: 90,
    riskLevel: "critical",
    isCrownJewel: true,
    namespace: "default",
    description: "Database credentials — Crown Jewel asset",
    permissions: [],
    cves: [],
  },
  {
    id: "secret-api-key",
    type: "secret",
    label: "api-keys",
    riskScore: 85,
    riskLevel: "critical",
    isCrownJewel: true,
    namespace: "default",
    description: "External API keys and tokens — Crown Jewel asset",
    permissions: [],
    cves: [],
  },
  {
    id: "pod-database",
    type: "pod",
    label: "postgres-pod",
    riskScore: 78,
    riskLevel: "high",
    isCrownJewel: true,
    namespace: "default",
    description: "PostgreSQL database pod — Crown Jewel",
    permissions: [],
    cves: mockCVEs["pod-database"],
  },
  {
    id: "ns-kube-system",
    type: "namespace",
    label: "kube-system",
    riskScore: 45,
    riskLevel: "medium",
    description: "Core Kubernetes system namespace",
    permissions: [],
    cves: [],
  },
];

export const mockAttackPaths: AttackPath[] = [
  {
    id: "path-1",
    name: "Internet → DB Credential Theft",
    severity: "critical",
    nodes: ["internet", "pod-webapp", "sa-default", "role-clusteradmin", "secret-db"],
    description:
      "Attacker exploits webapp CVE to gain pod shell, then escalates via default service account to steal DB credentials.",
    steps: [
      "Exploit CVE-2024-21626 in webapp-pod to escape container",
      "Access default service account token at /var/run/secrets/kubernetes.io/serviceaccount",
      "Use service account to enumerate cluster resources via kubectl",
      "Discover cluster-admin ClusterRoleBinding",
      "Access db-credentials secret directly",
    ],
  },
  {
    id: "path-2",
    name: "API Server → Cluster Takeover",
    severity: "critical",
    nodes: ["pod-api", "sa-admin", "role-clusteradmin", "secret-api-key", "pod-database"],
    description:
      "Compromised API pod leverages over-privileged service account to achieve full cluster admin access.",
    steps: [
      "Exploit CVE-2023-38545 in api-server-pod",
      "Read mounted service account token",
      "Discover cluster-admin-sa has ClusterAdmin binding",
      "List all secrets across namespaces",
      "Access api-keys and postgres-pod database",
    ],
  },
  {
    id: "path-3",
    name: "RBAC Escalation via Pod Creation",
    severity: "high",
    nodes: ["pod-webapp", "role-podrw", "sa-default", "secret-db"],
    description:
      "Attacker with pod creation privileges mounts sensitive secrets by creating malicious pods.",
    steps: [
      "Gain access to pod with pod-readwrite role",
      "Create new pod mounting /etc/kubernetes/admin.conf as volume",
      "Execute commands in newly created privileged pod",
      "Access db-credentials secret via volume mount",
    ],
  },
];

// React Flow formatted nodes
export function getFlowNodes(highlightedPath?: string[]): Node[] {
  const positions: Record<string, { x: number; y: number }> = {
    internet: { x: 50, y: 300 },
    "pod-webapp": { x: 250, y: 150 },
    "pod-api": { x: 250, y: 450 },
    "sa-default": { x: 500, y: 200 },
    "sa-admin": { x: 500, y: 500 },
    "role-clusteradmin": { x: 750, y: 350 },
    "role-podrw": { x: 750, y: 150 },
    "secret-db": { x: 1000, y: 250 },
    "secret-api-key": { x: 1000, y: 450 },
    "pod-database": { x: 1200, y: 350 },
    "ns-kube-system": { x: 500, y: 650 },
  };

  return mockGraphNodes.map((node) => ({
    id: node.id,
    type: "customNode",
    position: positions[node.id] || { x: 0, y: 0 },
    data: {
      ...node,
      highlighted: highlightedPath?.includes(node.id),
    },
  }));
}

export function getFlowEdges(highlightedPath?: string[]): Edge[] {
  const edges: Array<{
    id: string;
    source: string;
    target: string;
    animated?: boolean;
    type?: string;
  }> = [
    { id: "e1", source: "internet", target: "pod-webapp" },
    { id: "e2", source: "internet", target: "pod-api" },
    { id: "e3", source: "pod-webapp", target: "sa-default" },
    { id: "e4", source: "pod-api", target: "sa-admin" },
    { id: "e5", source: "sa-default", target: "role-clusteradmin" },
    { id: "e6", source: "sa-admin", target: "role-clusteradmin" },
    { id: "e7", source: "sa-default", target: "role-podrw" },
    { id: "e8", source: "role-clusteradmin", target: "secret-db" },
    { id: "e9", source: "role-clusteradmin", target: "secret-api-key" },
    { id: "e10", source: "role-podrw", target: "secret-db" },
    { id: "e11", source: "secret-db", target: "pod-database" },
    { id: "e12", source: "sa-admin", target: "ns-kube-system" },
    { id: "e13", source: "pod-api", target: "sa-default" },
  ];

  return edges.map((edge) => {
    const isHighlighted =
      highlightedPath &&
      highlightedPath.includes(edge.source) &&
      highlightedPath.includes(edge.target);

    return {
      ...edge,
      animated: isHighlighted || false,
      style: {
        stroke: isHighlighted
          ? "#ef4444"
          : edge.source === "internet"
          ? "#00d4ff"
          : "rgba(139, 92, 246, 0.6)",
        strokeWidth: isHighlighted ? 3 : 1.5,
        filter: isHighlighted ? "drop-shadow(0 0 6px #ef4444)" : undefined,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: isHighlighted ? "#ef4444" : "rgba(139, 92, 246, 0.6)",
      },
    };
  });
}

export const scanLogs = [
  { delay: 300, text: "Connecting to Kubernetes API server...", type: "info" },
  { delay: 800, text: "✔ Connected to cluster (mock-cluster-prod)", type: "success" },
  { delay: 1200, text: "Fetching pods across all namespaces...", type: "info" },
  { delay: 1800, text: "✔ Found 47 pods in 8 namespaces", type: "success" },
  { delay: 2200, text: "Scanning ServiceAccount bindings...", type: "info" },
  { delay: 2800, text: "⚠ Detected 3 over-privileged ServiceAccounts", type: "warning" },
  { delay: 3200, text: "Analyzing RBAC ClusterRoleBindings...", type: "info" },
  { delay: 3800, text: "✔ Mapped 24 RoleBindings, 6 ClusterRoleBindings", type: "success" },
  { delay: 4200, text: "Enumerating Secrets in default namespace...", type: "info" },
  { delay: 4800, text: "⚠ Found 2 Crown Jewel secrets exposed to pods", type: "warning" },
  { delay: 5200, text: "Enriching nodes with CVE database...", type: "info" },
  { delay: 5800, text: "✔ Matched 4 CVEs (2 critical, 1 high, 1 medium)", type: "success" },
  { delay: 6200, text: "Building attack path graph...", type: "info" },
  { delay: 6800, text: "✔ Graph constructed: 11 nodes, 13 edges", type: "success" },
  { delay: 7200, text: "Running path-finding algorithms...", type: "info" },
  { delay: 7800, text: "✔ Discovered 3 attack paths (2 critical, 1 high)", type: "success" },
  { delay: 8200, text: "Generating risk scores...", type: "info" },
  { delay: 8600, text: "✔ Scan complete. Overall risk: CRITICAL", type: "critical" },
];

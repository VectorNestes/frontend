import type {
  GraphData,
  Vulnerability,
  AttackPath,
  CriticalNode,
  SimulationResult,
} from "./types";

const BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : "http://localhost:3001";

const TIMEOUT_MS = 5000;

async function fetchJSON<T>(path: string): Promise<T> {
  const url = `${BASE}${path}`;
  console.log("[api] GET", url);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
    const data = await res.json();
    console.log("[api] OK", url, data);
    return data as T;
  } catch (err) {
    console.error("[api] ERROR", url, err);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const url = `${BASE}${path}`;
  console.log("[api] POST", url, body);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
    const data = await res.json();
    console.log("[api] POST OK", url, data);
    return data as T;
  } catch (err) {
    console.error("[api] POST ERROR", url, err);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export function getGraph(): Promise<GraphData> {
  return fetchJSON<GraphData>("/api/graph");
}

export function getVulnerabilities(): Promise<Vulnerability[]> {
  return fetchJSON<Vulnerability[]>("/api/vulnerabilities").then((d) =>
    Array.isArray(d) ? d : []
  );
}

export function getPaths(): Promise<AttackPath[]> {
  return fetchJSON<AttackPath[]>("/api/paths").then((d) =>
    Array.isArray(d) ? d : []
  );
}

export function getCriticalNode(): Promise<CriticalNode> {
  return fetchJSON<CriticalNode>("/api/critical-node");
}

export function simulate(nodeId: string): Promise<SimulationResult> {
  return postJSON<SimulationResult>("/api/simulate", { nodeId });
}

export async function getReport(): Promise<string> {
  const data = await fetchJSON<unknown>("/api/report");
  if (typeof data === "string") return data;
  const d = data as Record<string, unknown>;
  return typeof d.content === "string"
    ? d.content
    : JSON.stringify(data, null, 2);
}

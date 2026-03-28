import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const scanCluster = async (options?: { mock?: boolean; kubeconfig?: string }) => {
  const { data } = await api.post("/scan", options);
  return data;
};

export const getGraph = async () => {
  const { data } = await api.get("/graph");
  return data;
};

export const getAttackPaths = async () => {
  const { data } = await api.get("/paths");
  return data;
};

export const login = async (email: string, password: string) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

export const signup = async (name: string, email: string, password: string) => {
  const { data } = await api.post("/auth/signup", { name, email, password });
  return data;
};

export default api;

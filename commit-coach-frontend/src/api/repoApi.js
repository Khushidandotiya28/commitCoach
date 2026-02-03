import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password });

export const signupUser = (name, email, password) =>
  api.post("/auth/signup", { name, email, password });

export const analyzeRepo = (repoUrl, token) =>
  api.post(
    "/repo/analyze",
    { repoUrl },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const getRepoHistory = (token) =>
  api.get("/repo/history", { headers: { Authorization: `Bearer ${token}` } });

export const deleteRepo = async (repoId, token) => {
  return await api.delete(`/repo/${repoId}`, { 
    headers: { Authorization: `Bearer ${token}` },
  });
};

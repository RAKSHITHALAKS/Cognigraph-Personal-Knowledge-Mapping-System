import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

// --- Auth ---
export const signupUser = async (data) => {
  const response = await axios.post(`${API_URL}/auth/signup`, data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await axios.post(`${API_URL}/auth/login`, data);
  return response.data;
};

// --- Nodes ---
export const getNodes = async (user_id) => {
  const url = user_id ? `${API_URL}/nodes/?user_id=${user_id}` : `${API_URL}/nodes/`;
  const response = await axios.get(url);
  return response.data;
};

export const createNode = async (data) => {
  const response = await axios.post(`${API_URL}/nodes/`, data);
  return response.data;
};

// --- Edges ---
export const getEdges = async () => {
  const response = await axios.get(`${API_URL}/edges/`);
  return response.data;
};

export const createEdge = async (data) => {
  const response = await axios.post(`${API_URL}/edges/`, data);
  return response.data;
};

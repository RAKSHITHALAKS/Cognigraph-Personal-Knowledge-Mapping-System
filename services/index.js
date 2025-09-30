import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // Your FastAPI URL

// ----- User APIs -----
export const signupUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/signup`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/login`, userData);
  return response.data;
};

// ----- Node APIs -----
export const getNodes = async () => {
  const response = await axios.get(`${API_URL}/nodes/`);
  return response.data;
};

export const createNode = async (nodeData) => {
  const response = await axios.post(`${API_URL}/nodes/`, nodeData);
  return response.data;
};

// ----- Edge APIs -----
export const getEdges = async () => {
  const response = await axios.get(`${API_URL}/edges/`);
  return response.data;
};

export const createEdge = async (edgeData) => {
  const response = await axios.post(`${API_URL}/edges/`, edgeData);
  return response.data;
};

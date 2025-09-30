import React, { useState, useEffect } from "react";
import { getNodes, createNode, loginUser } from "../services/api";
import EdgeForm from "../components/EdgeForm";
import NodeGraph from "../components/NodeGraph";

const Dashboard = () => {
  // State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [nodes, setNodes] = useState([]);
  const [graphKey, setGraphKey] = useState(0);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Fetch nodes when user logs in
  useEffect(() => {
    if (user) fetchNodes();
  }, [user]);

  const fetchNodes = async () => {
    try {
      const data = await getNodes(user?.id);
      setNodes(data);
    } catch (error) {
      console.error("Error fetching nodes:", error);
    }
  };

  // Node creation
  const handleCreateNode = async (e) => {
    e.preventDefault();
    if (!title || !description) return;

    const newNode = {
      title,
      description,
      user_id: user.id,
    };

    try {
      await createNode(newNode);
      setTitle("");
      setDescription("");
      fetchNodes();
      setGraphKey((prev) => prev + 1); // refresh NodeGraph
    } catch (error) {
      console.error("Error creating node:", error.response || error.message);
      alert("Failed to create node. Check console for details.");
    }
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) return;

    try {
      const res = await loginUser({ username, password });
      localStorage.setItem("user", JSON.stringify(res));
      setUser(res);
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Login failed:", error.response || error.message);
      alert("Login failed. Check credentials.");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setNodes([]);
  };

  // If not logged in, show login form
  if (!user) {
    return (
      <div
        style={{
          maxWidth: "400px",
          margin: "50px auto",
          padding: "20px",
          background: "linear-gradient(to right, #f5f7fa, #c3cfe2)",
          borderRadius: "15px",
          boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#003366" }}>Login</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontWeight: "bold", color: "#003366" }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                marginLeft: "10px",
                padding: "5px",
                borderRadius: "5px",
                border: "1px solid #003366",
              }}
              required
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontWeight: "bold", color: "#003366" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                marginLeft: "10px",
                padding: "5px",
                borderRadius: "5px",
                border: "1px solid #003366",
              }}
              required
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              backgroundColor: "#003366",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  // If logged in, show full dashboard
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "auto",
        padding: "20px",
        background: "linear-gradient(to right, #f5f7fa, #c3cfe2)",
        borderRadius: "15px",
        boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ color: "#003366" }}>Welcome, {user.username}!</h3>
        <button
          onClick={handleLogout}
          style={{
            padding: "5px 10px",
            backgroundColor: "#ff3333",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <h1 style={{ textAlign: "center", color: "#003366" }}>Dashboard</h1>

      {/* Node Creation Form */}
      <form
        onSubmit={handleCreateNode}
        style={{
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: "#ffffffcc",
          borderRadius: "10px",
          boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontWeight: "bold", color: "#003366" }}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              marginLeft: "10px",
              padding: "5px",
              borderRadius: "5px",
              border: "1px solid #003366",
            }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ fontWeight: "bold", color: "#003366" }}>Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{
              marginLeft: "10px",
              padding: "5px",
              borderRadius: "5px",
              border: "1px solid #003366",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            backgroundColor: "#003366",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Create Node
        </button>
      </form>

      {/* Nodes List */}
      <h2 style={{ color: "#003366" }}>Nodes List</h2>
      <ul>
        {nodes.map((node) => (
          <li
            key={node.id}
            style={{
              backgroundColor: "#e6f2ff",
              marginBottom: "8px",
              padding: "8px",
              borderRadius: "5px",
              boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <strong>{node.title}</strong>: {node.description}
          </li>
        ))}
      </ul>

      {/* Edge Creation Form */}
      <h2 style={{ color: "#003366", marginTop: "20px" }}>Connect Nodes (Create Edge)</h2>
      <EdgeForm />

      {/* Node Graph */}
      <NodeGraph key={graphKey} />
    </div>
  );
};

export default Dashboard;

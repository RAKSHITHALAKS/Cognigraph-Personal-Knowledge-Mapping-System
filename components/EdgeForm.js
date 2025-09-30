import React, { useState, useEffect } from "react";
import { getNodes, createEdge } from "../services/api";

const EdgeForm = ({ onEdgeCreated }) => {
  const [nodes, setNodes] = useState([]);
  const [fromNode, setFromNode] = useState("");
  const [toNode, setToNode] = useState("");

  useEffect(() => {
    fetchNodes();
  }, []);

  const fetchNodes = async () => {
    const data = await getNodes();
    setNodes(data);
  };

  const handleCreateEdge = async (e) => {
    e.preventDefault();
    if (!fromNode || !toNode) return;

    try {
      await createEdge({ from_node: parseInt(fromNode), to_node: parseInt(toNode) });
      setFromNode("");
      setToNode("");
      alert("Edge created successfully!");
      if (onEdgeCreated) onEdgeCreated(); // refresh graph
    } catch (error) {
      console.error("Error creating edge:", error);
      alert("Failed to create edge");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Create Edge</h3>
      <form onSubmit={handleCreateEdge}>
        <select value={fromNode} onChange={(e) => setFromNode(e.target.value)} required>
          <option value="">From Node</option>
          {nodes.map((node) => (
            <option key={node.id} value={node.id}>
              {node.title}
            </option>
          ))}
        </select>
        <select value={toNode} onChange={(e) => setToNode(e.target.value)} required>
          <option value="">To Node</option>
          {nodes.map((node) => (
            <option key={node.id} value={node.id}>
              {node.title}
            </option>
          ))}
        </select>
        <button type="submit">Create Edge</button>
      </form>
    </div>
  );
};

export default EdgeForm;

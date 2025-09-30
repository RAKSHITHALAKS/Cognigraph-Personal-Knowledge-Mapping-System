import React, { useEffect, useState } from "react";
import ReactFlow, { MiniMap, Controls, Background, useReactFlow } from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import { getNodes, getEdges } from "../services/api";

// Dagre config
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 180;
const nodeHeight = 80;

// helper for layout
const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
      sourcePosition: isHorizontal ? "right" : "bottom",
      targetPosition: isHorizontal ? "left" : "top",
    };
  });

  return { nodes: layoutedNodes, edges };
};

const NodeGraph = () => {
  const [rawNodes, setRawNodes] = useState([]);
  const [rawEdges, setRawEdges] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [layoutDirection, setLayoutDirection] = useState("TB"); // default top-to-bottom

  const applyLayout = (direction) => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      rawNodes,
      rawEdges,
      direction
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    setLayoutDirection(direction);
  };

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const nodesData = await getNodes();
        const edgesData = await getEdges();

        // Map nodes
        const mappedNodes = nodesData.map((node) => ({
          id: `${node.id}`,
          type: "default",
          data: {
            label: (
              <div>
                {node.title}
                <br />
                {node.description}
              </div>
            ),
          },
          style: {
            padding: "10px",
            border: "2px solid #003366",
            borderRadius: "10px",
            backgroundColor: "#cce6ff",
            color: "#003366",
            fontWeight: "bold",
            minWidth: "150px",
            transition: "transform 0.2s, box-shadow 0.2s", // for hover effect
          },
        }));

        // Map edges
        const mappedEdges = edgesData.map((edge) => ({
          id: `e${edge.id}`,
          source: `${edge.from_node}`,
          target: `${edge.to_node}`,
          animated: true,
          style: {
            stroke: "#003366",
            transition: "stroke 0.2s, stroke-width 0.2s", // for hover
          },
          markerEnd: { type: "arrowclosed" },
        }));

        setRawNodes(mappedNodes);
        setRawEdges(mappedEdges);

        // Initial layout
        applyLayout("TB");
      } catch (error) {
        console.error("Error loading graph:", error);
      }
    };

    fetchGraph();
  }, []);

  // Export graph as JSON
  const exportGraphJSON = () => {
    const data = { nodes, edges };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "graph.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ marginTop: "20px" }}>
      {/* Layout Toggle Buttons */}
      <div style={{ marginBottom: "10px", textAlign: "center" }}>
        <button
          onClick={() => applyLayout("TB")}
          style={{
            marginRight: "10px",
            padding: "6px 12px",
            borderRadius: "6px",
            border: layoutDirection === "TB" ? "2px solid #003366" : "1px solid #999",
            background: layoutDirection === "TB" ? "#cce6ff" : "#f0f0f0",
            cursor: "pointer",
          }}
        >
          Top to Bottom
        </button>
        <button
          onClick={() => applyLayout("LR")}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            border: layoutDirection === "LR" ? "2px solid #003366" : "1px solid #999",
            background: layoutDirection === "LR" ? "#cce6ff" : "#f0f0f0",
            cursor: "pointer",
          }}
        >
          Left to Right
        </button>
        <button
          onClick={exportGraphJSON}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #003366",
            background: "#003366",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Export JSON
        </button>
      </div>

      {/* Handle empty states */}
      {nodes.length === 0 && <p style={{ textAlign: "center", color: "#003366" }}>No nodes available.</p>}
      {edges.length === 0 && nodes.length > 0 && <p style={{ textAlign: "center", color: "#003366" }}>No edges yet. Connect some nodes!</p>}

      {/* Graph */}
      <div
        style={{
          height: "500px",
          border: "1px solid #003366",
          borderRadius: "10px",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={(event, node) =>
            alert(`Node Details:\nTitle: ${node.data.label.props.children[0]}\nDescription: ${node.data.label.props.children[2]}`)
          }
          onEdgeClick={(event, edge) =>
            alert(`Edge Details:\nFrom: ${edge.source}\nTo: ${edge.target}`)
          }
          nodeTypes={{}}
        >
          <MiniMap nodeStrokeColor={() => "#003366"} nodeColor={() => "#cce6ff"} nodeBorderRadius={10} />
          <Controls />
          <Background color="#f0f0f0" gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default NodeGraph;

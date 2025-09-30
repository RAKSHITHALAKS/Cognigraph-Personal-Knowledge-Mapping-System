import React, { useState } from "react";
import { createNode } from "../services/api";

const NodeForm = ({ refreshNodes }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createNode({ title, description, user_id: 1 }); // user_id=1 for simplicity
      setTitle("");
      setDescription("");
      refreshNodes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      /><br/><br/>
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      /><br/><br/>
      <button type="submit">Create Node</button>
    </form>
  );
};

export default NodeForm;

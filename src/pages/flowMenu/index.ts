/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
/*import React, { useState, useEffect } from "react";
import "./FlowListMenu.css"; // Ensure this CSS file is updated for new styles
import { Box } from "reactflow";

const flowListAPI = "https://polyglot-api-staging.polyglot-edu.com/api/flows/";

const FlowListIndex=()=> {
  const [flows, setFlows] = useState([]);

  useEffect(() => {
    fetch(flowListAPI)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setFlows(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  return (
    <>
    <Box>
      <h1>Learning Paths</h1>
      <div className="card-container">
        {flows.map((flow) => (
          <div className="card" key={flow._id}>
            <h2>{flow.title}</h2>
            <p>{flow.description}</p>
            <p>N° activities: {flow.nodes.length}</p>
            <div className="author-info">Author: {flow.author.username}</div>
            <div className="tags">
              {flow.tags.map((tag) => (
                <span
                  key={tag._id}
                  className="tag"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <button
              className="selectBtn"
              onClick={() => {
                if (flow.nodes == []) {
                  alert(
                    "This learning path does not have any activities yet, you cannot do it",
                  );
                  return;
                }
                WA.player.state.actualFlow = flow._id;
              }}
              disabled={WA.player.state.actualFlow == flow._id}
              title="If this button is disabled, you have already selected it."
            >
              SELECT LP
            </button>
          </div>
        ))}
      </div>
    </Box>
    </>
  );
};

export default FlowListIndex;*/

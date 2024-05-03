/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from "react";
import "./FlowShower.css"; // Ensure this CSS file is updated for new styles

const flowListAPI = "https://polyglot-api-staging.polyglot-edu.com/api/flows/";

function FlowShower(flowId) {
  const [flow, setFlow] = useState();
  console.log();
  useEffect(() => {
    fetch(flowListAPI + flowId.flowId)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setFlow(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  return (
    <div>
      <h1>Learning Paths</h1>
      <div className="card-container">
        <div className="card" key={flow._id}>
          <button
            onClick={() => {
              const message = {
                message: "Hello from iframe",
                date: Date.now(),
              };
              console.log("lato webapp " + message.message);
              parent.postMessage(message, "*");
              console.log(parent.postMessage(message, "*"));
            }}
          >
            Choose this flow
          </button>
          <h2>{flow.title}</h2>
          <p>{flow.description}</p>
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
        </div>

      </div>
    </div>
  );
}

export default FlowShower;

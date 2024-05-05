/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from "react";
import "./FlowListMenu.css"; // Ensure this CSS file is updated for new styles

const flowListAPI = "https://polyglot-api-staging.polyglot-edu.com/api/flows/";

function FlowListMenu() {
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
    <div>
      <h1>Learning Paths</h1>
      <div className="card-container">
        {flows.map((flow) => (
          <div className="card" key={flow._id}>
            <button
              onClick={() => {
                const message = {
                  flowId: flow._id,
                  date: Date.now(),
                };
                console.log("lato webapp " + message.flowId);
                window.top.postMessage(message, "*");
                window.parent.postMessage(message, "*");
                console.log(window.parent.postMessage(message, "*"));
              }}
            >
              first way
            </button>
            <button
              onClick={() => {
                var data = { foo: flow._id };
                var event = new CustomEvent("myCustomEvent", { detail: data });
                window.parent.document.dispatchEvent(event);
              }}
            >
              second way
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
        ))}
      </div>
    </div>
  );
}

export default FlowListMenu;

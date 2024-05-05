/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from "react";
import "./FlowListMenu.css"; // Ensure this CSS file is updated for new styles

function FlowShower(flowId) {
  const [flows, setFlows] = useState();

  const flowListAPI =
    "https://polyglot-api-staging.polyglot-edu.com/api/flows/" + flowId.flowId;
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
  console.log(flows);
  let tags = [{ name: "No Tag defined", color: "grey", _id: "00000" }];
  let nodes = [
    {
      title: "Empty",
      description: "This flow has no nodes yet",
      platform: "Not defined",
      type: "Not defined",
    },
  ];
  try {
    const prova = flows;
    if (prova.tags) tags = prova.tags;
    console.log(tags);
    if (prova.nodes) nodes = prova.nodes;
    console.log(nodes);
  } catch (e) {
    console.log(e);
  }
  if (!flows) return <div>loading</div>;
  return (
    <div>
      <h1>Welcome in our little educational space</h1>
      <div>This world is divided in 5 areas:</div>
      <ul>
        <li>
          <p color="#5db048">"outside"</p>: where you can rest in our quiet zone
          and the flows menu where you can choose which learning path you want
          to do;
        </li>
        <li>
          <color color="#434fbf">"webapp"</color>: from the single laptop on the
          left, there you can access to our webapp to execute some lessons;
        </li>
        <li>
          <color color="#878686">"Computer Lab"</color>: in the multiple
          computer area, you will be able to do coding exercise;
        </li>
        <li>
          <color color="#e68c17">"White Board"</color>: on the top right area
          you can do collaborative assigment;
        </li>
        <li>
          <color color="#b322e3">"Room Meeting"</color>: inside the private
          room, it's possible to have private meeting with the educator or
          expert that can help you with your doubts;
        </li>
      </ul>
      <div>
        These are the information of the learning path you have selected, if you
        want to change learning path you can do it from the joystick area
        outside.
      </div>
      <div className="card-container" key={flows._id}>
        <h2>{flows.title}</h2>
        <div>{flows.description}</div>
        {tags.map((tag) => (
          <span
            key={tag._id}
            className="tag"
            style={{ backgroundColor: tag.color }}
          >
            {tag.name}
          </span>
        ))}
        {nodes.map((node) => (
          <div>
            <span key={node._id}>
              {node.title}
              <br />
              {node.type}
              <br />
              {node.description}
              <br />
              {node.platform}
              <br />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FlowShower;

/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from "react";
import "./FlowListMenu.css"; // Ensure this CSS file is updated for new styles

const list = {
  multipleChoiceQuestionNode: "Multichoice Question",
  closeEndedQuestionNode: "Close Ended Question",
  ReadMaterialNode: "Read Material Activity",
  lessonTextNode: "Read Material Activity",
  OpenQuestionNode: "Open Qeestion",
  TrueFalseNode: "True False Question",
  WatchVideoNode: "Watch Video Activity",
  SummaryNode: "Summary Activity",
  codingQuestionNode: "Coding Exercise",
  aaa: "aaa",
};

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
    if (prova.nodes) nodes = prova.nodes;
  } catch (e) {
    console.log(e);
  }
  if (!flows) return <div>loading</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome in our little educational space</h1>
      <div>This world is divided in 5 areas:</div>
      <ul>
        <li>
          <span style={{ color: "#5db048" }}>"outside"</span>: where you can
          rest in our quiet zone and the flows menu where you can choose which
          learning path you want to do;
        </li>
        <li>
          <span style={{ color: "#434fbf" }}>"webapp"</span>: from the single
          laptop on the left, there you can access to our webapp to execute some
          lessons;
        </li>
        <li>
          <span style={{ color: "#878686" }}>"Computer Lab"</span>: in the
          multiple computer area, you will be able to do coding exercise;
        </li>
        <li>
          <span style={{ color: "#e68c17" }}>"White Board"</span>: on the top
          right area you can do collaborative assigment;
        </li>
        <li>
          <span style={{ color: "#b322e3" }}>"Room Meeting"</span>: inside the
          private room, it's possible to have private meeting with the educator
          or expert that can help you with your doubts;
        </li>
      </ul>
      <div>
        These are the information of the learning path you have selected, if you
        want to change learning path you can do it from the joystick area
        outside.
      </div>
      <div className="" key={flows._id}>
        <h3>{flows.title}</h3>
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
        <h3>These are the activities of this learning path. </h3>
        <p>(Disclaimer: they are not in order)</p>
        <div className="card-container">
          {nodes.map((node) => (
            <div className="card" key={node._id}>
              <h3>{node.title}</h3>
              <p>
                {list[node.type]}
                <br />
                {node.description}
                <br />
                platform: {node.platform}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FlowShower;

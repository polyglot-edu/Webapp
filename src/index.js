import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import OpenQuest from "./OpenQuest";
import TrueFalseQuiz from "./TrueFalseQuiz";
import reportWebVitals from "./reportWebVitals";
import WatchVideo from "./WatchVideo";
import ReadMaterial from "./ReadMaterial";
import Summary from "./Summary";
import FlowListMenu from "./FlowListMenu";
import FlowShower from "./FlowShower";

//I take the data to understand what is the first page to open
const urlParams = new URLSearchParams(window.location.search);

const flowList = urlParams.get("flowList");
if (flowList != null) {
  // here we open the list of learning paths
  if (flowList !== "") {
    console.log("here open the learning path info");
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      // take current URL
      <React.StrictMode>
        <FlowShower flowId={flowList} />
      </React.StrictMode>,
    );
  } else {
    console.log("here open the learning path list");
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      // take current URL
      <React.StrictMode>
        <FlowListMenu />
      </React.StrictMode>,
    );
  }
} else {
  // here we check the other type of pages

  const rememberTipologyQuiz = urlParams.get("rememberTipologyQuiz");
  let globalv = rememberTipologyQuiz;

  //in base of the value of globav I open a page
  if (globalv === "multipleChoiceQuestionNode") {
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      // take current URL
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  } else if (globalv === "closeEndedQuestionNode") {
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      // take current URL
      <React.StrictMode>
        <OpenQuest />
      </React.StrictMode>,
    );
  } else if (globalv === "TrueFalseNode") {
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      // take current URL
      <React.StrictMode>
        <TrueFalseQuiz />
      </React.StrictMode>,
    );
  } else if (globalv === "WatchVideoNode") {
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      // take current URL
      <React.StrictMode>
        <WatchVideo />
      </React.StrictMode>,
    );
  } else if (globalv === "ReadMaterialNode" || globalv === "lessonTextNode" ) {
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      // take current URL
      <React.StrictMode>
        <ReadMaterial />
      </React.StrictMode>,
    );
  } else if (globalv === "SummaryNode") {
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      // take current URL
      <React.StrictMode>
        <Summary />
      </React.StrictMode>,
    );
  }
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React, { useState, useEffect } from "react";
import "./ReadMaterial.css";

/*
------------TAKE THE API AND THE DATA TO MANAGE THE PROPRIETIES OF THE QUIZ------------------
*/

// take current URL
const urlParams = new URLSearchParams(window.location.search);

// take the value of parameter ctx --> it is the code now specific next the code of the quiz of my node
const rememberCtx = urlParams.get("ctx");

// take the value of the parameter rememberLearningPath --> it is the name of learning path that i selected
//const rememberLearningPath = urlParams.get('rememberLearningPath');

let i = 0;

//Api to take the info about the next and current quiz
const apiQuizUrlActual =
  "https://polyglot-api-staging.polyglot-edu.com/api/execution/actual";
const apiQuizNext =
  "https://polyglot-api-staging.polyglot-edu.com/api/execution/next";

//to save and send the type of the next quiz
let rememberTipologyQuiz = "";

//if next quiz is vscode i save here the link for the download
let linkForDownload = "";

function ReadMaterial() {
  const [link, setLink] = useState("");
  const [text, setText] = useState("");
  const [ctx, setCtx] = useState("0"); //CTX VARIABLE
  const [id, setId] = useState("1"); //ID VALIDATION VARIABLE
  const [nextQuizType, setNextQuizType] = useState("2"); //NEXT QUIZ TYPE VARIABLE
  let textlink = "";

  //To remember what page is the last //this operation is important that it is on api
  let [currentPage, setCurrentPage] = useState(() => {
    i = 0;
    // Read current page form localStorage
    return localStorage.getItem("quiz7Page") || "inizioQuiz7";
  });

  if (i == 0) {
    setCurrentPage("inizioQuiz7");
    currentPage = "inizioQuiz7";
    i++;
  }

  //remember the last page and set it
  useEffect(() => {
    localStorage.setItem("quiz7Page", currentPage);
  }, [currentPage]);

  //take the information from the Api with actual
  const actualQuizData = {
    ctxId: rememberCtx, //everytime the same
  };

  const nextQuizRequestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(actualQuizData),
  };

  // Make the POST request for the actual quiz
  fetch(apiQuizUrlActual, nextQuizRequestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error in the request");
      }
      return response.json();
    })
    .then((data) => {
      // Handle the response data for the actual quiz Api
      // You may want to update the state or perform other actions based on the response

      //console.log('data:  ',data);

      if (data.data.link) {
        setLink(data.data.link);
        textlink = "Link to have more information about the topic";
      } else {
        setLink("");
        textlink = "";
      }
      setCtx(rememberCtx);
      setId(data.validation);
      setText(data.data.text);
    })
    .catch((error) => {
      console.error("Error in the nextQuiz request:", error.message);
      console.error("Dettagli dell'errore:", error);
    });

  //to change the page in base of what is the current page --> function called to understand what is the next page
  /*const handleNextClick = () => {
      console.log(currentPage);
      
        if(currentPage === 'inizioQuiz7'){
          setCurrentPage('NextVs');
        }
      
    };*/

  //function used only to check if all the pages do their job
  /*
      const goBackToQuiz7 = () => {
        if(currentPage === 'inizioQuiz7'){
          setCurrentPage('quiz7');
        }else if (currentPage === 'NextVs'){
          setCurrentPage('quiz7')
        }
      };
      */

  if (currentPage === "quiz7") {
    return (
      <div className="ReadMaterial">
        <div className="first_line">
          <img
            className="logo"
            src="https://i.postimg.cc/yNNSbWdG/logo-polyglot-1.png"
          ></img>
        </div>
        <div className="second_line">
          <h1 className="h1">Theory</h1>
          <button className="startq" id="startq">
            Click here to start!
          </button>
        </div>
      </div>
    );
  } else if (currentPage === "inizioQuiz7") {
    return inizioQuiz7(
      /*goBackToQuiz7,*/ setCurrentPage,
      text,
      link,
      ctx,
      id,
      textlink,
    );
  } else if (currentPage === "NextVs") {
    return NextVs(/*goBackToQuiz7*/);
  }
}

//second page
function inizioQuiz7(
  /*goBackToQuiz7,*/ setCurrentPage,
  text,
  link,
  ctx,
  id,
  textlink,
) {
  return (
    <div className="start" id="start">
      <div className="first_line2">
        <img
          className="logo"
          src="https://i.postimg.cc/yNNSbWdG/logo-polyglot-1.png"
        ></img>
      </div>
      <div className="second_line2">
        <h1 className="q1">Theory</h1>
        <div className="q">
          <pre className="text1">{text}</pre>
          <a href={link} target=":blank">
            {textlink}
          </a>
        </div>
      </div>
      <div className="third_line2">
        <button id="Exit" className="Exit" onClick={exit}>
          Save
        </button>
        <button
          id="Next2"
          className="Next2"
          onClick={() => nextQuiz(setCurrentPage, ctx, id)}
        >
          Next Activity
        </button>
      </div>
    </div>
  );
}

//function to save the last page that i see and exit
function exit() {
  window.close();
}

//third page called only if the next node is for VsCode platform
function NextVs(/*goBackToQuiz7*/) {
  return (
    <div className="Vscode">
      <div className="first_line2">
        <img
          className="logo"
          src="https://i.postimg.cc/yNNSbWdG/logo-polyglot-1.png"
        ></img>
      </div>
      <div className="second_line">
        <h1 className="h1vs">
          The next exercise is in VSCode, please open your notebook and run
          again the scripts
        </h1>
      </div>
    </div>
  );

  //<button onClick={goBackToQuiz5}>return</button>   //DON'T CANCEL BECAUSE YOU CAN USE TO SEE IF ALL GO OK
}

//function to understand if i need to open VsCode node so calling NextVs or if next node is for WebApp so I open the next WebApp node
function nextQuiz(setCurrentPage, ctx, id) {
  const nextQuizData = {
    ctxId: ctx,
    satisfiedConditions: id[0].id,
  };

  const nextQuizRequestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nextQuizData),
  };

  // Make the POST request for the next quiz
  fetch(apiQuizNext, nextQuizRequestOptions)
    .then((response) => {
      console.log("resp", response);
      if (!response.ok) {
        throw new Error("Error in the request");
      }
      return response.json();
    })
    .then((data) => {
      //console.log('dataNext:   ',data);

      // Handle the response data for the next quiz
      // You may want to update the state or perform other actions based on the response
      rememberTipologyQuiz = data.type;
      let platform = data.platform;

      // eslint-disable-next-line no-undef
      WA.player.state.platform = platform; //update actual platform for workadventure 

      if (platform === "WebApp") {
        i = 0;

        window.location.href = `/?rememberTipologyQuiz=${encodeURIComponent(rememberTipologyQuiz)}&ctx=${encodeURIComponent(ctx)}`;
      } else {
        if (i == 1) {
          setCurrentPage("NextVs");
        }
      }
    })
    .catch((error) => {
      console.error("Error in the nextQuiz request:", error.message);
      console.error("Dettagli dell'errore:", error);
    });
}

export default ReadMaterial;

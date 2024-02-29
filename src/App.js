/*
---------------------LIBRARY----------------------
*/

import './App.css';
import React, { useEffect, useState } from 'react';//useless to use state in a functional component



/*
-------------GLOBAL VARIABLES----------------------
*/

let exportedComponent;//to know the quiz to open first

let score;//to remember the score of the quiz, this variable must be send to my api to upgrade the total score of my player

//variable to color the button
let colorright = "lightgreen";
let colorwrong = "lightcoral";

//to send the right id
let takeid; 
let remembercorrectId = '';


/*
------------TAKE THE API AND THE DATA TO MANAGE THE PROPRIETIES OF THE QUIZ------------------
*/

// take current URL 
const urlParams = new URLSearchParams(window.location.search);

// take the value of parameter rememberCtx --> it is the code now specific next the code of the quiz of my node 
const rememberCtx = urlParams.get('ctx');

// take the value of the parameter rememberLearningPath --> it is the name of learning path that i selected
//const rememberLearningPath = urlParams.get('rememberLearningPath');

let i = 0;

//Api to take the info about the next and current quiz
const apiQuizUrlActual = 'https://polyglot-api-staging.polyglot-edu.com/api/execution/actual';
const apiQuizNext = 'https://polyglot-api-staging.polyglot-edu.com/api/execution/next';

//to save and send the type of the next quiz
let rememberTipologyQuiz = '';

//if next quiz is vscode i save here the link for the download
let linkForDownload = '';

/*
---------------AFTER TAKE THE TYPE OF QUIZ I DECIDE WHAT QUIZ TO OPEN------------
*/

  exportedComponent = App;

   

/*
-------FIRST TYPOLOGY----------------
*/

//First quiz
function App() {

  score = 0;//when i start the quiz score is 0

  //currentPage take trace regarding the current page
  //setCurrentPage is useless to change the page
 //To remember what page is the last //this operation is important that it is on api
  let [currentPage, setCurrentPage] = useState(() => {
    i= 0;
    // Read current page form localStorage
    return localStorage.getItem('quizPage') || 'startQuiz';
  });

if(i === 0){
  setCurrentPage('startQuiz');
  currentPage = 'startQuiz';
  i++;
}

//remember the last page and set it
useEffect(() => {
  localStorage.setItem('quizPage',currentPage);
},[currentPage]);

  const [question, setQuestion] = useState('');//QUESTION VARIABLE
  const [quantityAnswer, setQuantityAnswer] = useState('');//QUANTITY OF ANSWER IN MY QUIZ
  const [tipologyAnswer, setTipologyAnswer] = useState('');
  const [choice, setChoice] = useState(2);
  const [ctx, setCtx] = useState('0');//CTX VARIABLE
  const [id, setId] = useState('1');//ID VALIDATION VARIABLE
  const [nextQuizType, setNextQuizType] = useState('2');//NEXT QUIZ TYPE VARIABLE
  const [validation, setValidation] = useState('4');


    //take the information from the Api with actual
    const actualQuizData = {
      ctxId: rememberCtx,//everytime the same
    };

    const nextQuizRequestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(actualQuizData),
    };


    //console.log(nextQuizRequestOptions);
    // Make the POST request for the next quiz
    fetch(apiQuizUrlActual, nextQuizRequestOptions)
    .then((response) => {
      if (!response.ok) {
        console.log(response);
        throw new Error('Error in the request');
      }
      return response.json();
    })
    .then((data) => {
      // Handle the response data for the next quiz
      // You may want to update the state or perform other actions based on the response
      //console.log(data);

      setCtx(rememberCtx);
      setId(data.validation)
      //take the question
      setQuestion(data.data.question);//to change

      //take answer
      setTipologyAnswer(data.data.choices);

      //take number of answer
      setQuantityAnswer(tipologyAnswer.length);


      setChoice(data.data.isChoiceCorrect);

      setValidation(data.validation);
      takeid = validation;


    })
    .catch((error) => {
      console.error('Error in the nextQuiz request:', error.message);
      console.error('Dettagli dell\'errore:', error);
    });


  /*
  //remove the comment if you want to testing the movement in the different page
  const restartQuiz = () => {
    console.log("restart page");
    setCurrentPage('App');
  };
  */

  return (
    <div className="General">
      {currentPage === 'App' && (//if i am in currentPage == App
        <div className="App">
          <div className='first_line'>
            <img className="logo" src="https://i.postimg.cc/yNNSbWdG/logo-polyglot-1.png"></img>
          </div>
          <div className='second_line'>
            <h1 className="h1">Quiz</h1>
            <button className="startq" id='startq'>
              Click here to start!
            </button>
          </div>
        </div>
      )}

      {currentPage === 'startQuiz' && <StartQuiz setCurrentPage={setCurrentPage} ctx={ctx}  validation={validation}/*restartQuiz={restartQuiz}*/ question={question} quantityAnswer={quantityAnswer} tipologyAnswer={tipologyAnswer} choice={choice}/>}
      {currentPage === 'NextVs' && <NextVs /*restartQuiz={restartQuiz}*/ />}
    </div>
  );
}

//second page of first quiz
function StartQuiz({/*restartQuiz,*/ setCurrentPage, ctx, question, validation,quantityAnswer, tipologyAnswer, choice}) {
  const isCorrectButtonDisabled = localStorage.getItem('correctButtonDisabled') === 'true';
  //assign to the button the function onclick

  const buttonClickHandler = (index) => {
    if (choice[index]) {
      Right(choice,quantityAnswer,validation);
    } else {
      Wrong(choice,quantityAnswer,validation);
    }
  };


  //generate the button in base of the quantityAnswer
  const lines = [];
  for (let i = 0; i < quantityAnswer; i += 2) {
    const lineButtons = [];
    const option1 = tipologyAnswer[i];
    const option2 = tipologyAnswer[i + 1];

    lineButtons.push(
      <button key={`button${i}`} className={`w${i + 1}`} id={`w${i + 1}`} onClick={() => buttonClickHandler(i)}>{/* Button content */} {option1}</button>
      );
    lineButtons.push(
      <button key={`button${i + 1}`} className={`w${i + 2}`} id={`w${i + 2}`} onClick={() => buttonClickHandler(i + 1)}>{/* Button content */} {option2}</button>
    );
    lines.push(
      <div key={`line${i / 2 + 1}`} className={`line${i / 2 + 1}`}>
        {lineButtons}
      </div>
    );
  }

  return (
    <div className="start">
      <div className='first_line'>
        <img className="logo" src="https://i.postimg.cc/yNNSbWdG/logo-polyglot-1.png"></img>
      </div>
      <div className= "second_line">
        <h1 className="q1">Quiz</h1>
        <div className='q'>
          <button className="quest1">{question}?</button>
        </div>
        <div className="startbutton">
          {lines}
        </div>
      </div>
      {/*<button className='res' id="res" onClick={restartQuiz}>Restart Quiz To Developer</button> */}
      <div className='third_line'>
        <button className='save' id='save' onClick={exit}>Save</button>
        <button className='question2' id="question2" onClick={()=> nextQuiz(ctx,setCurrentPage)}>Next Activity</button>
      </div>
    </div>
  );
}

//third page called only if the next node is for VsCode platform
function NextVs(/*goBackToQuiz7*/){
  
  return(
    <div className='Vscode'>
      <div className='first_line2'>
        <img className="logo" src="https://i.postimg.cc/yNNSbWdG/logo-polyglot-1.png"></img>
      </div>
      <div className='second_line'>
        <h1 className='h1vs'>The next page is a Code exercise, you need to turn back on Vscode and reload the second run line to do the Code exercise</h1>
      </div>
    </div> 
  )


  //<button onClick={goBackToQuiz5}>return</button>   //DON'T CANCEL BECAUSE YOU CAN USE TO SEE IF ALL GO OK
}


//manage the wrong and right respond
function Wrong(choice,quantityAnswer,validation){

  //disable button and change the color
  for (let i = 0; i < quantityAnswer; i++) {
    const button = document.getElementById(`w${i + 1}`);
    button.disabled = true;

    if (choice[i]) {//==true
      button.style.backgroundColor = colorright;

    } else {
      button.style.backgroundColor = colorwrong;
    }
  }

  for(let i = 0; i < takeid.length; i++){
    if(takeid[i].title == 'Fail'){
      remembercorrectId = takeid[i].id;

    }
  }

  localStorage.setItem('correctButtonDisabled', 'true');//disable the true button to avoid thata  player reload page and give the right response
}

//manage the wrong and right respond
function Right(choice,quantityAnswer,validation){

  //disable button and change the color
  for (let i = 0; i < quantityAnswer; i++) {
    const button = document.getElementById(`w${i + 1}`);
    button.disabled = true;

    if (choice[i]) {//==true
      button.style.backgroundColor = colorright;
    } else {
      button.style.backgroundColor = colorwrong;

    }
  }

  for(let i = 0; i < takeid.length; i++){

    if(takeid[i].title == 'Pass'){
      remembercorrectId = takeid[i].id;

    }
  }
  score++;

  //save the state of correct button
  localStorage.setItem('correctButtonDisabled', 'true');//disable the button to avoid that a player reload page and click a lot of the button to increase his score

  
}

function exit(){
  window.close();
}

function nextQuiz(ctx,setCurrentPage){

  
  const nextQuizData = {
    ctxId: ctx,
    satisfiedConditions: remembercorrectId
  };

  const nextQuizRequestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(nextQuizData),
  };

  // Make the POST request for the next quiz
  fetch(apiQuizNext, nextQuizRequestOptions)
  .then((response) => {
    if (!response.ok) {
  
      throw new Error('Error in the request');
    }
    return response.json();
  })
  .then((data) => {

    //console.log(data);
            
    // Handle the response data for the next quiz
    // You may want to update the state or perform other actions based on the response
    rememberTipologyQuiz = data.type;//need to repair this line
    let platform = data.platform;

    if(platform === 'WebApp'){
      i = 0;
      console.log(ctx);
      //console.log(rememberLearningPath);
      console.log(rememberTipologyQuiz);

      window.location.href = `https://polyglot-webapp.polyglot-edu.com/?rememberTipologyQuiz=${encodeURIComponent(rememberTipologyQuiz)}&ctx=${encodeURIComponent(ctx)}`;
    }else{
      
      if(i == 1){
        setCurrentPage('NextVs');
      }   
    } 
  })
  .catch((error) => {
    console.error('Error in the nextQuiz request:', error.message);
    console.error('Dettagli dell\'errore:', error);
  });
}


export default exportedComponent;//show the quiz that i select on my webview vscode

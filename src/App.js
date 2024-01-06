/*
---------------------LIBRARY----------------------
*/

//import logo from './logo.svg'; to import imagine or file of this folder
import './App.css';
import React, { useEffect, useState } from 'react';//useless to use state in a functional component
import Quiz2 from './Quiz2'; // Importa il file Quiz2.js
import inizioQuiz2 from './Quiz2';
import { toHaveFormValues } from '@testing-library/jest-dom/dist/matchers';
import OpenQuest from './OpenQuest';
import TrueFalseQuiz from './TrueFalseQuiz';


/*
-------------GLOBAL VARIABLES----------------------
*/

let globalv = "closeEndedQuestionNode";//send the parameter by the webview like machinelearning
//when webview send to the backend what quiz must be open the webapp read to my api the name of the variable
//my react app see the variable and in base of the value he chose what page show on web app
//this is the id_title  on api so when webview upgrade that  the webapp take it and now what is the path that student chose


let exportedComponent;//to know the quiz to open first
let score;//to remember the score of the quiz, this variable must be send to my api to upgrade the total score of my player

//variable to color the button
let colorright = "lightgreen";
let colorwrong = "lightcoral";



/*
------------TAKE THE API AND THE DATA TO MANAGE THE PROPRIETIES OF THE QUIZ------------------
*/

// take current URL 
const urlParams = new URLSearchParams(window.location.search);

// take the value of parameter rememberId --> it is the code now specific next the code of the quiz of my node 
const rememberId = urlParams.get('rememberId');

// take the value of the parameter rememberLearningPath --> it is the name of learning path that i selected
const rememberLearningPath = urlParams.get('rememberLearningPath');

//console.log('rememberId:', rememberId);
//console.log('rememberLearningPath:', rememberLearningPath);

const apiQuizUrl = 'https://polyglot-api-staging.polyglot-edu.com/api/execution/first';

const rememberTipologyQuiz = urlParams.get('rememberTipologyQuiz');



/*
---------------AFTER TAKE THE TYPE OF QUIZ I DECIDE WHAT QUIZ TO OPEN------------
*/

//globalv = rememberTipologyQuiz;
globalv = "TrueFalse";
console.log('globalv: ' ,globalv);

if (globalv === "multiplechoice") {
  exportedComponent = App;
}else{
  if(globalv === "closeEndedQuestionNode"){
    exportedComponent = OpenQuest;
  }else{
    if(globalv === "TrueFalse"){
      exportedComponent = TrueFalseQuiz;
    }
  }
}



/*
-------FIRST TYPOLOGY----------------
*/

//First quiz
function App() {

  score = 0;//when i start the quiz score is 0

  //currentPage take trace regarding the current page
  //setCurrentPage is useless to change the page
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'App';
  });

  const [question, setQuestion] = useState('');//QUESTION VARIABLE
  const [quantityAnswer, setQuantityAnswer] = useState(0);//QUANTITY OF ANSWER IN MY QUIZ
  const [tipologyAnswer, setTipologyAnswer] = useState(1);
  const [choice, setChoice] = useState(2);

  //when i do the quiz i need to remember the last page that i open 
  useEffect(() =>{
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);


  //console.log(rememberId);
  //data to send in the POST request
const postData = {
  flowId: rememberId
};
const requestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(postData)
};

//do the call to the API
fetch(apiQuizUrl, requestOptions)
.then(response => {
  if(!response.ok){
    throw new Error('Error in the request');
  }
  return response.json();
})
.then(data => {
  //console.log('data received:', data);

  //take the question
  setQuestion(data.firstNode.data.question);

   //take answer
   setTipologyAnswer(data.firstNode.data.choices);

   //take number of answer
   setQuantityAnswer(tipologyAnswer.length);

   setChoice(data.firstNode.data.isChoiceCorrect);

})
.catch(error => {
  console.error('Errore nella chiamata API:', error.message);
});

  
  //check in what page i am and manage the movement in the quiz pages
  const nextPage = () => {
    setCurrentPage((prevPage) => {
      if (prevPage === 'App') {
        return 'startQuiz';
      } else if (prevPage === 'startQuiz') {
        return 'GoQ2';
      }
      // Add more conditions for additional pages if needed
      return prevPage;
    });
  };

  
  //remove the comment if you want to testing the movement in the different page
  const restartQuiz = () => {
    console.log("restart page");
    setCurrentPage('App');
  };
  

  return (
    <div className="General">
      {currentPage === 'App' && (//if i am in currentPage == App
        <div className="App">
          <div className='first_line'>
            <img className="logo" src="https://i.postimg.cc/yNNSbWdG/logo-polyglot-1.png"></img>
          </div>
          <div className='second_line'>
            <h1 className="h1">{rememberLearningPath}</h1>
            <button className="startq" id='startq' onClick={nextPage}>
              Click here to start!
            </button>
          </div>
        </div>
      )}

      {currentPage === 'startQuiz' && <StartQuiz nextPage={nextPage} /*restartQuiz={restartQuiz}*/ question={question} quantityAnswer={quantityAnswer} tipologyAnswer={tipologyAnswer} choice={choice}/>}
      {currentPage === 'GoQ2' && <GoQ2 restartQuiz={restartQuiz} />}
    </div>
  );
}

//second page of first quiz
function StartQuiz({/*restartQuiz,*/ nextPage, question, quantityAnswer, tipologyAnswer, choice}) {
  const isCorrectButtonDisabled = localStorage.getItem('correctButtonDisabled') === 'true';

  //assign to the button the function onclick
  const buttonClickHandler = (index) => {
    if (choice[index]) {
      Right(choice,quantityAnswer);
    } else {
      Wrong(choice,quantityAnswer);
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
        <h1 className="q1">{rememberLearningPath} Quiz</h1>
        <div className='q'>
          <button className="quest1">{question}?</button>
        </div>
        <div className="startbutton">
          {lines}
        </div>
      </div>
      {/*<button className='res' id="res" onClick={restartQuiz}>Restart Quiz To Developer</button> */}
      <div className='third_line'>
        <button className='save' id='save' onClick={exit}>Save and Exit</button>
        <button className='question2' id="question2" onClick={nextPage}>Next Activity</button>
      </div>
    </div>
  );
}

//third page of my first quiz
function GoQ2({restartQuiz}){
  return(
    <div>
      <h1>ciao</h1>
      <button className='res' id="res" onClick={restartQuiz}>Restart Quiz To Developer</button> 
      </div>
  )
}

//manage the wrong and right respond
function Wrong(choice,quantityAnswer){

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

  localStorage.setItem('correctButtonDisabled', 'true');//disable the true button to avoid thata  player reload page and give the right response

  console.log(score);
}

//manage the wrong and right respond
function Right(choice,quantityAnswer){

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

  score++;
  console.log(score);

  //save the state of correct button
  localStorage.setItem('correctButtonDisabled', 'true');//disable the button to avoid that a player reload page and click a lot of the button to increase his score

  
}

function exit(){
  window.close();
}

function nextQuiz(){
  //here I take the next quiz
  //if the score is the same of the total answer i send success and go to next node
  //if i have node with more than one quiz i need to eìsend the score to the next page
}


export default exportedComponent;//show the quiz that i select on my webview vscode

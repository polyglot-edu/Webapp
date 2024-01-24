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

//to send a variabile when i pass to the next page --> usefull to take the correct info to the API
let next = true; 

//variable to understand if the response is right or wrong
let isOk = false;

//to send the right id
let takeid; 
let remembercorrectId;


/*
------------TAKE THE API AND THE DATA TO MANAGE THE PROPRIETIES OF THE QUIZ------------------
*/

// take current URL 
const urlParams = new URLSearchParams(window.location.search);

// take the value of parameter rememberId --> it is the code now specific next the code of the quiz of my node 
const rememberId = urlParams.get('rememberId');

// take the value of the parameter rememberLearningPath --> it is the name of learning path that i selected
const rememberLearningPath = urlParams.get('rememberLearningPath');

//Api to take the info about the next and current quiz
const apiQuizUrl = 'https://polyglot-api-staging.polyglot-edu.com/api/execution/next';

//to save and send the type of the next quiz
let rememberTipologyQuiz = urlParams.get('rememberTipologyQuiz');



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
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'startQuiz';
  });

  const [question, setQuestion] = useState('');//QUESTION VARIABLE
  const [quantityAnswer, setQuantityAnswer] = useState(0);//QUANTITY OF ANSWER IN MY QUIZ
  const [tipologyAnswer, setTipologyAnswer] = useState(1);
  const [choice, setChoice] = useState(2);
  const [platform, setPlatform] = useState('3');
  const [ctx, setCtx] = useState('0');//CTX VARIABLE
  const [id, setId] = useState('1');//ID VALIDATION VARIABLE
  const [nextQuizType, setNextQuizType] = useState('2');//NEXT QUIZ TYPE VARIABLE
  const [validation, setValidation] = useState('4');


  //when i do the quiz i need to remember the last page that i open 
  useEffect(() =>{
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  
  //if in the Url there is the parameter with next i take the information to the api in this way
  if(urlParams.get('next')){

    const nextQuizData = {
      ctxId: urlParams.get('ctx'),//everytime the same
      satisfiedConditions: urlParams.get('id_i')//this id change
    };

    const nextQuizRequestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nextQuizData),
    };

    // Make the POST request for the next quiz
    fetch(apiQuizUrl, nextQuizRequestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error in the request');
      }
      return response.json();
    })
    .then((data) => {
      // Handle the response data for the next quiz
      // You may want to update the state or perform other actions based on the response

      setCtx(urlParams.get('ctx'));
      setId(data.validation)
      setPlatform(data.platform);
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

  }else{

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

      //take the text
      setCtx(data.ctx);
      setId(data.firstNode.validation);
      setPlatform(urlParams.get('rememberTypeQuiz'));
      
      //take the question
      setQuestion(data.firstNode.data.question);

      //take answer
      setTipologyAnswer(data.firstNode.data.choices);

      //take number of answer
      setQuantityAnswer(tipologyAnswer.length);

      setChoice(data.firstNode.data.isChoiceCorrect);

      setValidation(data.firstNode.validation);
      takeid = validation;
      
      
  })
  .catch(error => {
      console.error('Errore nella chiamata API:', error.message);
      console.log("bho");
  });
  }

  
  
  //check in what page i am and manage the movement in the quiz pages
  const nextPage = () => {
    setCurrentPage((prevPage) => {
      if (prevPage === 'App') {
        return 'startQuiz';
      } else if (prevPage === 'startQuiz') {
        return 'NextVs';
      }
      // Add more conditions for additional pages if needed
      return prevPage;
    });
  };

  /*
  //remove the comment if you want to testing the movement in the different page
  const restartQuiz = () => {
    console.log("restart page");
    setCurrentPage('App');
  };
  */

  return (
    <div className="General">
      {currentPage === 'App' && (//if i am in currentPage === App
        <div className="App">
          <div className='first_line'>
            <img className="logo" src="https://i.postimg.cc/yNNSbWdG/logo-polyglot-1.png" alt="logo"/>
          </div>
          <div className='second_line'>
            <h1 className="h1">{rememberLearningPath}</h1>
            <button className="startq" id='startq' onClick={nextPage}>
              Click here to start!
            </button>
          </div>
        </div>
      )}

      {currentPage === 'startQuiz' && <StartQuiz nextPage={nextPage} ctx={ctx} id={id} setNextQuizType={setNextQuizType} nextQuizType={nextQuizType} platform={platform} validation={validation}/*restartQuiz={restartQuiz}*/ question={question} quantityAnswer={quantityAnswer} tipologyAnswer={tipologyAnswer} choice={choice}/>}
      {currentPage === 'NextVs' && <NextVs /*restartQuiz={restartQuiz}*/ />}
    </div>
  );
}

//second page of first quiz
function StartQuiz({/*restartQuiz,*/ nextPage, ctx, id, setNextQuizType, nextQuizType, platform, question, validation,quantityAnswer, tipologyAnswer, choice}) {
  // const isCorrectButtonDisabled = localStorage.getItem('correctButtonDisabled') === 'true';

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
        <img className="logo" src="https://i.postimg.cc/yNNSbWdG/logo-polyglot-1.png" alt="logo"/>
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
        <button className='question2' id="question2" onClick={()=> nextQuiz(ctx,id,setNextQuizType,nextQuizType,platform,nextPage)}>Next Activity</button>
      </div>
    </div>
  );
}

//third page called only if the next node is for VsCode platform
function NextVs(/*goBackToQuiz3*/){
  return(
    <div>
      <h1>Go back to Vscode and click there the button next to continue the Flow</h1>
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

  localStorage.setItem('correctButtonDisabled', 'true');//disable the true button to avoid thata  player reload page and give the right response
  isOk = false;
  console.log(score);
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
  score++;
  isOk = true;
  console.log(score);

  //save the state of correct button
  localStorage.setItem('correctButtonDisabled', 'true');//disable the button to avoid that a player reload page and click a lot of the button to increase his score

  
}

function exit(){
  window.close();
}

function nextQuiz(ctx,id,setNextQuizType,nextQuizType,platform,nextPage){
  
  const nextQuizData = {
    ctxId: ctx,
    satisfiedConditions: id[0].id
  };

  const nextQuizRequestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(nextQuizData),
  };

  // Make the POST request for the next quiz
  fetch(apiQuizUrl, nextQuizRequestOptions)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Error in the request');
    }
    return response.json();
  })
  .then((data) => {

    console.log(data);
    let id_i;
            
    // Handle the response data for the next quiz
    // You may want to update the state or perform other actions based on the response
    rememberTipologyQuiz = data.type;//need to repair this line

    if(isOk === false){

      for(let i = 0; i < takeid.length; i++){
        if(takeid[i].title === 'Fail'){
          id_i = takeid[1].id;

        }
      }
      //implement to return with fail

      if(platform === 'WebApp'){

    
        window.location.href = `http://127.0.0.1:3000/?rememberId=${encodeURIComponent(rememberId)}&rememberLearningPath=${encodeURIComponent(rememberLearningPath)}&rememberTipologyQuiz=${encodeURIComponent(rememberTipologyQuiz)}&next=${encodeURIComponent(next)}&ctx=${encodeURIComponent(ctx)}&id_i=${encodeURIComponent(id_i)}`;
      }else{
      
        nextPage();
      }
    }else{

      for(let i = 0; i < takeid.length; i++){
        if(takeid[i].title === 'Pass'){
          id_i = takeid[0].id;

        }
      }

      //implement to return with true
      if(platform === 'WebApp'){
        
        console.log(remembercorrectId);
        window.location.href = `http://127.0.0.1:3000/?rememberId=${encodeURIComponent(rememberId)}&rememberLearningPath=${encodeURIComponent(rememberLearningPath)}&rememberTipologyQuiz=${encodeURIComponent(rememberTipologyQuiz)}&next=${encodeURIComponent(next)}&ctx=${encodeURIComponent(ctx)}&id_i=${encodeURIComponent(id_i)}`;
      }else{
      
        nextPage();
      }

    }
    
  })
  .catch((error) => {
    console.error('Error in the nextQuiz request:', error.message);
    console.error('Dettagli dell\'errore:', error);
  });
}


export default exportedComponent;//show the quiz that i select on my webview vscode

import React, { useState, useEffect } from 'react';
import './OpenQuest.css';


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
-------------GLOBAL VARIABLES----------------------
*/

//other variables
let numberOfWords;
var quantityAnswerAsString;
var isCorrect1;

//var to check the score
let score = 0;


//to send the right id
let takeid; 
let remembercorrectId;

//function that is launch 
function OpenQuest(){

    const [question, setQuestion] = useState('');//QUESTION VARIABLE
    const [quantityAnswer, setQuantityAnswer] = useState(0);//QUANTITY OF ANSWER IN MY QUIZ
    const [tipologyAnswer, setTipologyAnswer] = useState(1);
    const [ctx, setCtx] = useState('0');//CTX VARIABLE
    const [id, setId] = useState('1');//ID VALIDATION VARIABLE
    const [nextQuizType, setNextQuizType] = useState('2');//NEXT QUIZ TYPE VARIABLE
    const [validation, setValidation] = useState('4');

    //To remember what page is the last //this operation is important that it is on api
    let [currentPage, setCurrentPage] = useState(() => {
      i = 0;
      // Read current page form localStorage
      return localStorage.getItem('quiz3Page') || 'inizioQuiz3';
    });

    if(i === 0){
      setCurrentPage('inizioQuiz3');
      currentPage = 'inizioQuiz3';
      i++;
    }

    //remember the state of check button
    const [isButtonCheckDisabled, setIsButtonCheckDisabled] = useState(() => {
      return localStorage.getItem('isButtonCheckDisabled') === 'false';
    });

    //remember the last page and set it
    useEffect(() => {
      localStorage.setItem('quiz3Page',currentPage);
      localStorage.setItem('isButtonCheckDisabled', isButtonCheckDisabled);
    },[currentPage,isButtonCheckDisabled]);

    //if in the Url there is the parameter with actual i take the information to the api in this way

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
      setId(data.validation);
      setQuestion(data.data.question);

    
      //take number of world answer
      setQuantityAnswer(data.data.correctAnswers);//check if it is right
      quantityAnswerAsString = String(quantityAnswer);
      var rememberWords = quantityAnswerAsString.split(' ');
      numberOfWords = rememberWords.length;
      setValidation(data.validation);

      takeid = validation;

    })
    .catch((error) => {
      console.error('Error in the nextQuiz request:', error.message);
      console.error('Dettagli dell\'errore:', error);
    });

  //function used only to check if all the pages do their job
  /*
  const goBackToQuiz3 = () => {
    if(currentPage === 'inizioQuiz3'){
      setCurrentPage('quiz3');
    }else if (currentPage === 'NextVs'){
      setCurrentPage('quiz3')
    }
  };
  */

    
      if (currentPage === 'quiz3') {
        return (
          <div className="OpenQuest">
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
        );
      }else if (currentPage === 'inizioQuiz3') {

        return inizioQuiz3(/*goBackToQuiz3,*/ctx,id,setNextQuizType,nextQuizType,setCurrentPage,question,setIsButtonCheckDisabled,isButtonCheckDisabled);
      }else if (currentPage === 'NextVs'){
          return NextVs(/*goBackToQuiz3*/);
      }
}

function inizioQuiz3(/*goBackToQuiz3,*/ctx,id,setNextQuizType,nextQuizType,setCurrentPage,question,setIsButtonCheckDisabled,isButtonCheckDisabled) {

    return(
        <div className = 'start' id='start'>
            <div className='first_line2'>
                <img className="logo" src="https://i.postimg.cc/yNNSbWdG/logo-polyglot-1.png"></img>
            </div>
            <div className= "second_line2">
                <h1 className="q1">Quiz</h1>
                <div className='q'>
                    <button className="quest1">{question}</button>
                </div>
                <div className="starttext">
                  <label className="Text" htmlFor="areaOfText">Use exactly {numberOfWords} word/s and write the first letter in capital letters:</label>
                  <div className='textarea-container'>
                    <textarea className='areaOfText' id="areaOfText" name="areaOfText" rows="4" cols="80"></textarea>
                  </div>
                  <h1 id="resp" className='resp'>{isCorrect1}</h1>
                  <button id='ButtonCheck' className='ButtonCheck' onClick={() => saveText(setIsButtonCheckDisabled)} disabled={isButtonCheckDisabled}>Check</button>
                </div>
            </div>
            <div className='third_line2'>
              <button id="Exit" className='Exit' onClick={exit}>Save</button>
              <button id='Next2' className='Next2' onClick={() => nextQuiz(ctx,setCurrentPage)}>Next Activity</button>
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


//to remember the response and upgrade the score to check next node
function saveText(setIsButtonCheckDisabled){
  var insertText = document.getElementById("areaOfText").value;
  if(insertText === quantityAnswerAsString){
    
    isCorrect1 = 'Your answer is right';
    document.getElementById("resp").style.color = 'green';
    for(let i = 0; i < takeid.length; i++){

      if(takeid[i].title == 'Pass'){
        remembercorrectId = takeid[i].id;
      }
    }
    score++;
  }else{
    
    isCorrect1 = 'Your answer is wrong.\n' + 'The correct answer was: ' + quantityAnswerAsString;
    document.getElementById("resp").style.color = 'red';
    for(let i = 0; i < takeid.length; i++){
      if(takeid[i].title == 'Fail'){
        remembercorrectId = takeid[i].id;
      }
    }
  }

  setIsButtonCheckDisabled(true);
}

//function to save the last page that i see and exit
function exit(){
  urlParams.close();
}

//function to understand if i need to open VsCode node so calling NextVs or if next node is for WebApp so I open the next WebApp node
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
    //console.log(rememberTipologyQuiz);
    let platform = data.platform;


    if(platform === 'WebApp'){

      i = 0;
    
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

export default OpenQuest;

import React, { useState, useEffect } from 'react';
import './OpenQuest.css';


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
const rememberTipologyQuiz = urlParams.get('rememberTipologyQuiz');

//other variables
let numberOfWords;
var quantityAnswerAsString;
var isCorrect1;

//var to check the score
let score = 0;

//to send a variabile when i pass to the next page --> usefull to take the correct info to the API
let next = true; 

//variable to understand if the response is right or wrong
let isOk = false;

//function that is launch 
function OpenQuest(){

    const [question, setQuestion] = useState('');//QUESTION VARIABLE
    const [quantityAnswer, setQuantityAnswer] = useState(0);//QUANTITY OF ANSWER IN MY QUIZ
    const [tipologyAnswer, setTipologyAnswer] = useState(1);
    const [platform, setPlatform] = useState('3');
    const [ctx, setCtx] = useState('0');//CTX VARIABLE
    const [id, setId] = useState('1');//ID VALIDATION VARIABLE
    const [nextQuizType, setNextQuizType] = useState('2');//NEXT QUIZ TYPE VARIABLE
   
    //To remember what page is the last //this operation is important that it is on api
    const [currentPage, setCurrentPage] = useState(() => {
      // Read current page form localStorage
      return localStorage.getItem('quiz3Page') || 'quiz3';
    });

    //remember the state of check button
    const [isButtonCheckDisabled, setIsButtonCheckDisabled] = useState(() => {
      return localStorage.getItem('isButtonCheckDisabled') === 'true';
    });

    //remember the last page and set it
    useEffect(() => {
      localStorage.setItem('quiz3Page',currentPage);
      localStorage.setItem('isButtonCheckDisabled', isButtonCheckDisabled);
    },[currentPage,isButtonCheckDisabled]);

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
        setQuestion(data.firstNode.data.question);
    
        //take number of world answer
        setQuantityAnswer(data.firstNode.data.correctAnswers);
        quantityAnswerAsString = String(quantityAnswer);
        var rememberWords = quantityAnswerAsString.split(' ');
        numberOfWords = rememberWords.length;

      })
      .catch((error) => {
        console.error('Error in the nextQuiz request:', error.message);
        console.error('Dettagli dell\'errore:', error);
      });
    }else{//if i am in the first node of the flow

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
        
        setQuestion(data.firstNode.data.question);
    
        //take number of world answer
        setQuantityAnswer(data.firstNode.data.correctAnswers);
        quantityAnswerAsString = String(quantityAnswer);
        var rememberWords = quantityAnswerAsString.split(' ');
        numberOfWords = rememberWords.length;
    })
    .catch(error => {
        console.error('Errore nella chiamata API:', error.message);
        console.log("bho");
    });
  }

  //to change the page in base of what is the current page --> function called to understand what is the next page 
  const handleNextClick = () => {
    if(currentPage === 'quiz3'){
      setCurrentPage('inizioQuiz3');
    }else{
      if(currentPage === 'inizioQuiz3'){
        setCurrentPage('NextVs');
      }
    }
  };

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
                <h1 className="h1">{rememberLearningPath}</h1>
                <button className="startq" id='startq' onClick={handleNextClick}>
                  Click here to start!
                </button>
              </div>
          </div>
        );
      }else if (currentPage === 'inizioQuiz3') {
        return inizioQuiz3(/*goBackToQuiz3,*/ctx,id,setNextQuizType,nextQuizType,platform,handleNextClick,question,tipologyAnswer,setIsButtonCheckDisabled,isButtonCheckDisabled);
      }else if (currentPage === 'NextVs'){
          return NextVs(/*goBackToQuiz3*/);
      }
}

function inizioQuiz3(/*goBackToQuiz3,*/ctx,id,setNextQuizType,nextQuizType,platform,handleNextClick,question,tipologyAnswer,setIsButtonCheckDisabled,isButtonCheckDisabled) {

  let response;

    return(
        <div className = 'start' id='start'>
            <div className='first_line2'>
                <img className="logo" src="https://i.postimg.cc/yNNSbWdG/logo-polyglot-1.png"></img>
            </div>
            <div className= "second_line2">
                <h1 className="q1">{rememberLearningPath} Quiz</h1>
                <div className='q'>
                    <button className="quest1">{question}</button>
                </div>
                <div className="starttext">
                  <label className="Text" htmlFor="areaOfText">Use exactly {numberOfWords} word/s:</label>
                  <div className='textarea-container'>
                    <textarea className='areaOfText' id="areaOfText" name="areaOfText" rows="4" cols="80"></textarea>
                  </div>
                  <h1 id="resp" className='resp'>{isCorrect1}</h1>
                  <button id='ButtonCheck' className='ButtonCheck' onClick={() => saveText(setIsButtonCheckDisabled)} disabled={isButtonCheckDisabled}>Check</button>
                </div>
            </div>
            <div className='third_line2'>
              <button id="Exit" className='Exit' onClick={exit}>Save and Exit</button>
              <button id='Next2' className='Next2' onClick={() => nextQuiz(ctx,id,setNextQuizType,nextQuizType,platform,handleNextClick)}>Next Activity</button>
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

//to remember the response and upgrade the score to check next node
function saveText(setIsButtonCheckDisabled){
  var insertText = document.getElementById("areaOfText").value;
  if(insertText === quantityAnswerAsString){
    isCorrect1 = 'Your answer is right';
    document.getElementById("resp").style.color = 'green';
    score++;
    console.log(score);
    isOk = true;
  }else{

    isCorrect1 = 'Your answer is wrong';
    document.getElementById("resp").style.color = 'red';
    isOk = false;
  }

  setIsButtonCheckDisabled(true);
}

//function to save the last page that i see and exit
function exit(){
  window.close();
}

//function to understand if i need to open VsCode node so calling NextVs or if next node is for WebApp so I open the next WebApp node
function nextQuiz(ctx,id,setNextQuizType,nextQuizType,platform,handleNextClick){
  
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
            
    // Handle the response data for the next quiz
    // You may want to update the state or perform other actions based on the response
    rememberTipologyQuiz = data.type;//need to repair this line
    
    let id_i = id[0].id;


    if(isOk === false){
      //implement to return with fail

      if(platform === 'WebApp'){
    
        //window.location.href = `http://127.0.0.1:3000/?rememberId=${encodeURIComponent(rememberId)}&rememberLearningPath=${encodeURIComponent(rememberLearningPath)}&rememberTipologyQuiz=${encodeURIComponent(rememberTipologyQuiz)}&next=${encodeURIComponent(next)}&ctx=${encodeURIComponent(ctx)}&id_i=${encodeURIComponent(id_i)}`;
      }else{
      
        //handleNextClick();
      }
    }else{
      //implement to return with true
      if(platform === 'WebApp'){
    
        //window.location.href = `http://127.0.0.1:3000/?rememberId=${encodeURIComponent(rememberId)}&rememberLearningPath=${encodeURIComponent(rememberLearningPath)}&rememberTipologyQuiz=${encodeURIComponent(rememberTipologyQuiz)}&next=${encodeURIComponent(next)}&ctx=${encodeURIComponent(ctx)}&id_i=${encodeURIComponent(id_i)}`;
      }else{
      
        //handleNextClick();
      }

    }
    
  })
  .catch((error) => {
    console.error('Error in the nextQuiz request:', error.message);
    console.error('Dettagli dell\'errore:', error);
  });
}

export default OpenQuest;
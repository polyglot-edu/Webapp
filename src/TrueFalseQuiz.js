import React, { useState, useEffect } from 'react';
import './TrueFalseQuiz.css';


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
-------------GLOBAL VARIABLES----------------------
*/

let score = 0;

let colorright = "lightgreen";
let colorwrong = "lightcoral";

//to send a variabile when i pass to the next page --> usefull to take the correct info to the API
let next = true; 

//variable to understand if the response is right or wrong
let isOk = false;

//to send the right id
let takeid; 
let remembercorrectId;


//First quiz
function TrueFalseQuiz(){
  
  //when i start the quiz score is 0
  score = 0;

  const [question, setQuestion] = useState('');//QUESTION VARIABLE
  const [answer, setAnswer] = useState('0');
  const [platform, setPlatform] = useState('3');
  const [ctx, setCtx] = useState('5');//CTX VARIABLE
  const [id, setId] = useState('1');//ID VALIDATION VARIABLE
  const [validation, setValidation] = useState('4');

  //currentPage take trace regarding the current page
  //setCurrentPage is useless to change the page
  const [currentPage, setCurrentPage] = useState(() => {
    // Read current page form localStorage
    return localStorage.getItem('quiz4Page') || 'NextVs';
  });

    //when i do the quiz i need to remember the last page that i open 
  useEffect(() => {
    // Save current page in localStorage for all hthe change of page
    localStorage.setItem('quiz4Page', currentPage);

    restoreCheckboxState();
  }, [currentPage]);

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
      setQuestion(data.data.instructions);

      setAnswer(data.data.isQuestionCorrect);

      setValidation(data.validation);
      takeid = validation;
    })
    .catch((error) => {
      console.error('Error in the nextQuiz request:', error.message);
      console.error('Dettagli dell\'errore:', error);
    });
  }else{

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
  
      //take the question
      setQuestion(data.firstNode.data.instructions);
  
      setAnswer(data.firstNode.data.isQuestionCorrect);
  
      setValidation(data.firstNode.validation);
      takeid = validation;

      //take the text
      setCtx(data.ctx);
      setId(data.firstNode.validation);
      setPlatform(urlParams.get('rememberTypeQuiz'));
   
  
    })
    .catch(error => {
      console.error('Errore nella chiamata API:', error.message);
    });
  }

  
  //check in what page i am and manage the movement in the quiz pages
  const handleNextClick = () => {
    if(currentPage === 'inizioQuiz4'){
      setCurrentPage('NextVs');
    }//else{
      //if(currentPage === 'inizioQuiz4'){
        //setCurrentPage('NextVs');
      //}
    //}
  };

  /*
    //remove the comment if you want to testing the movement in the different page
  const goBackToQuiz4 = () => {
    if(currentPage === 'inizioQuiz4'){
      setCurrentPage('quiz4');
    }else if (currentPage === 'NextVs'){
      setCurrentPage('quiz4')
    }
  };
  */

  //const to tick only one answer in quiz
  const handleCheckboxClick = (checkboxClass) => {
    const checkboxes = document.querySelectorAll('.start input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      if (checkbox.className !== checkboxClass) {
        checkbox.checked = false;
      }
    });
  };

  const restoreCheckboxState = () => {
    const checkboxes = document.querySelectorAll('.start input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      const isDisabled = localStorage.getItem(checkbox.className + '_disabled') === 'true';
      //checkbox.checked = !isDisabled; // Invert the value because we set the disable 
      //checkbox.disabled = isDisabled;
    });
  };

  //to change the color when i check the answer
  const checkColorAnswers = (setAnswer) => {

    const truecheck = document.getElementById('true').id;
    const falsecheck =  document.getElementById('false').id;
    const type = setAnswer[0].toString();
    const truecheckCheck = document.getElementById('true');
    const falsecheckCheck = document.getElementById('false');

    console.log(truecheck);
    console.log(type);

    if(truecheck === type){
      document.getElementById('true').parentElement.style.backgroundColor = colorright;
      document.getElementById('false').parentElement.style.backgroundColor = colorwrong;
    }else{
      document.getElementById('true').parentElement.style.backgroundColor = colorwrong;
      document.getElementById('false').parentElement.style.backgroundColor = colorright;
    }

    if (truecheckCheck.checked && truecheck === type) {
      score++;
      isOk = true;
    } else if (falsecheckCheck.checked && falsecheck === type) {
      isOk = false;
    }

    console.log(score);

    const allCheckboxes = document.querySelectorAll('.start input[type="checkbox"]');
    allCheckboxes.forEach((checkbox) => {
      checkbox.disabled = true;
      // Save the disabled state in localStorage
      localStorage.setItem(checkbox.className + '_disabled', true);
    });

    const checkButton = document.querySelector('.check');
    checkButton.classList.add('hidden');

  };

  if (currentPage === 'quiz4') {
    return (
      <div className="Quiz4">
          <div className='first_line'>
            <img className="logo" src="https://i.postimg.cc/yNNSbWdG/logo-polyglot-1.png"></img>
          </div>
          <div className='second_line'>
            <h1 className="h1">{rememberLearningPath}</h1>
            <button className="startq" id='startq' onClick={handleNextClick}>
              Clicca qui per iniziare!
            </button>
          </div>
      </div>
    );
  } else if (currentPage === 'inizioQuiz4') {
    return inizioQuiz4(ctx,id,validation,platform,answer,question,/*goBackToQuiz4,*/handleNextClick,handleCheckboxClick,checkColorAnswers);
  }else if (currentPage === 'page2Quiz4'){
    return NextVs(/*goBackToQuiz4*/);
  }
}

function inizioQuiz4(ctx,id,validation,platform,answer,question,/*goBackToQuiz4,*/handleNextClick,handleCheckboxClick,checkColorAnswers){

  return (
    <div className="start">
      <div className='first_line2'>
        <img className="logo" src="https://i.postimg.cc/yNNSbWdG/logo-polyglot-1.png"></img>
      </div>
      <div className= "second_line2">
        <h1 className="q1">{rememberLearningPath} Quiz</h1>
        <div className='q'>
          <button className="quest1">{question}</button>
        </div>
        <div className="startbutton">
          <div className='line1'>
            <label><input type="checkbox" id="true" className="true" value="true" onClick={() => handleCheckboxClick('true')} />True</label>
            <label><input type="checkbox" id="false" className="false" value="false" onClick={() => handleCheckboxClick('false')}/>False</label>
          </div>
          <div className='line3'>
            <button className='check' onClick={() => checkColorAnswers(answer)}>Check</button>
          </div>
        </div>
      </div>
      {/*<button className='res' id="res" onClick={goBackToQuiz2}>Restart Quiz To Developer</button> */}
      <div className='third_line2'>
        <button className='save' id='save' onClick={exit}>Save and Exit</button>
        <button className='question2' id="question2" onClick={() => nextQuiz(ctx,id,platform,handleNextClick)}>Next Activity</button>
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

function exit(){
    window.close();
  }
  
  function nextQuiz(ctx,id,platform,handleNextClick){

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
          if(takeid[i].title == 'Fail'){
            id_i = takeid[1].id;
            console.log(takeid[i]);
          }
        }
        //implement to return with fail
  
        if(platform === 'WebApp'){
  
      
          //window.location.href = `https://polyglot-webapp.polyglot-edu.com/?rememberId=${encodeURIComponent(rememberId)}&rememberLearningPath=${encodeURIComponent(rememberLearningPath)}&rememberTipologyQuiz=${encodeURIComponent(rememberTipologyQuiz)}&next=${encodeURIComponent(next)}&ctx=${encodeURIComponent(ctx)}&id_i=${encodeURIComponent(id_i)}`;
        }else{
        
          handleNextClick();
        }
      }else{
  
        for(let i = 0; i < takeid.length; i++){
          if(takeid[i].title == 'Pass'){
            id_i = takeid[0].id;
            console.log(id_i);
  
          }
        }
  
        //implement to return with true
        if(platform === 'WebApp'){
          
          //console.log(remembercorrectId);
          console.log("rememberId", rememberId);
          console.log("rememberLearningPath",rememberLearningPath);
          console.log("rememberTipologyQuiz",rememberTipologyQuiz);
          console.log("ctx",ctx);
          console.log("next",next);
          //window.location.href = `https://polyglot-webapp.polyglot-edu.com/?rememberId=${encodeURIComponent(rememberId)}&rememberLearningPath=${encodeURIComponent(rememberLearningPath)}&rememberTipologyQuiz=${encodeURIComponent(rememberTipologyQuiz)}&next=${encodeURIComponent(next)}&ctx=${encodeURIComponent(ctx)}&id_i=${encodeURIComponent(id_i)}`;
        }else{
        
          handleNextClick();
        }
  
      }
      
    })
    .catch((error) => {
      console.error('Error in the nextQuiz request:', error.message);
      console.error('Dettagli dell\'errore:', error);
    });


    }
  
  
  
  export default TrueFalseQuiz;

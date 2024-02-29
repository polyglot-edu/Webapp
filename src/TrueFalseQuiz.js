import React, { useState, useEffect } from 'react';
import './TrueFalseQuiz.css';


/*
------------TAKE THE API AND THE DATA TO MANAGE THE PROPRIETIES OF THE QUIZ------------------
*/

// take current URL 
const urlParams = new URLSearchParams(window.location.search);

// take the value of parameter rememberCtx --> it is the code now specific next the code of the quiz of my node 
const rememberCtx = urlParams.get('ctx');
console.log(rememberCtx);

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

let score = 0;

let colorright = "lightgreen";
let colorwrong = "lightcoral";

//to send the right id
let takeid = ''; 
let remembercorrectId = '';


//First quiz
function TrueFalseQuiz(){
  
  //when i start the quiz score is 0
  score = 0;


  const [question, setQuestion] = useState('');//QUESTION VARIABLE
  const [answer, setAnswer] = useState('0');
  const [ctx, setCtx] = useState('5');//CTX VARIABLE
  const [id, setId] = useState('1');//ID VALIDATION VARIABLE
  const [validation, setValidation] = useState('4');

  //currentPage take trace regarding the current page
  //setCurrentPage is useless to change the page
  let [currentPage, setCurrentPage] = useState(() => {
    i = 0;
    // Read current page form localStorage
    return localStorage.getItem('quiz4Page') || 'inizioQuiz4';
});

if(i === 0){
  setCurrentPage('inizioQuiz4');
  currentPage = 'inizioQuiz4';
  i++;
}

//remember the last page and set it
useEffect(() => {
    localStorage.setItem('quiz4Page',currentPage);
},[currentPage]);


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
    setQuestion(data.data.instructions);

    setAnswer(data.data.isQuestionCorrect);

    setValidation(data.validation);
    takeid = validation;

    })
    .catch((error) => {
      console.error('Error in the nextQuiz request:', error.message);
      console.error('Dettagli dell\'errore:', error);
    });

  /*
  //check in what page i am and manage the movement in the quiz pages
  const handleNextClick = () => {
    if(currentPage === 'inizioQuiz4'){
      setCurrentPage('NextVs');
    }//else{
      //if(currentPage === 'inizioQuiz4'){
        //setCurrentPage('NextVs');
      //}
    //}
  };*/

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

  /*
  const restoreCheckboxState = () => {
    const checkboxes = document.querySelectorAll('.start input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      const isDisabled = localStorage.getItem(checkbox.className + '_disabled') === 'true';
      //checkbox.checked = !isDisabled; // Invert the value because we set the disable 
      //checkbox.disabled = isDisabled;
    });
  };*/

  //to change the color when i check the answer
  const checkColorAnswers = (setAnswer) => {

    const truecheck = document.getElementById('true').id;
    const falsecheck =  document.getElementById('false').id;
    const type = setAnswer[0].toString();
    const truecheckCheck = document.getElementById('true');
    const falsecheckCheck = document.getElementById('false');

    console.log(truecheck);
    console.log(falsecheck);
    console.log(type);

    if(truecheck === type){
      document.getElementById('true').parentElement.style.backgroundColor = colorright;
      document.getElementById('false').parentElement.style.backgroundColor = colorwrong;
    }else{
      document.getElementById('true').parentElement.style.backgroundColor = colorwrong;
      document.getElementById('false').parentElement.style.backgroundColor = colorright;
    }

    if (truecheckCheck.checked && truecheck === type || falsecheckCheck.checked && falsecheck === type) {
      score++;
      for(let i = 0; i < takeid.length; i++){

        if(takeid[i].title == 'Pass'){
          remembercorrectId = takeid[i].id;
        }
      }
    } else if (falsecheckCheck.checked && falsecheck != type || truecheckCheck.checked && truecheck != type) {
      for(let i = 0; i < takeid.length; i++){
        if(takeid[i].title == 'Fail'){
          remembercorrectId = takeid[i].id;

        }
      }

    }


    const allCheckboxes = document.querySelectorAll('.start input[type="checkbox"]');
    allCheckboxes.forEach((checkbox) => {
      checkbox.disabled = true;
      // Save the disabled state in localStorage
      localStorage.setItem(checkbox.className + '_disabled', false);
    });

    const checkButton = document.querySelector('.check');
    checkButton.classList.add('hidden');

  };
  //currentPage = 'inizioQuiz4';
  if (currentPage === 'quiz4') {
    return (
      <div className="Quiz4">
          <div className='first_line'>
            <img className="logo" src="https://i.postimg.cc/yNNSbWdG/logo-polyglot-1.png"></img>
          </div>
          <div className='second_line'>
            <h1 className="h1">Quiz</h1>
            <button className="startq" id='startq'>
              Clicca qui per iniziare!
            </button>
          </div>
      </div>
    );
  } else if (currentPage === 'inizioQuiz4') {
    return inizioQuiz4(ctx,id,answer,question,/*goBackToQuiz4,*/setCurrentPage,handleCheckboxClick,checkColorAnswers);
  }else if (currentPage === 'NextVs'){
    return NextVs(/*goBackToQuiz4*/);
  }
}

function inizioQuiz4(ctx,id,answer,question,/*goBackToQuiz4,*/setCurrentPage,handleCheckboxClick,checkColorAnswers){
  console.log(question);
  return (
    <div className="start">
      <div className='first_line2'>
        <img className="logo" src="https://i.postimg.cc/yNNSbWdG/logo-polyglot-1.png"></img>
      </div>
      <div className= "second_line2">
        <h1 className="q1">Quiz</h1>
        <div className='q'>
          <button className="quest1">{question}</button>
        </div>
        <div className="startbutton">
          <div className='line1'>
            <label><input type="checkbox" id="true" className="true" value="true" onClick={() => handleCheckboxClick('true')} />True</label>
            <label><input type="checkbox" id="false" className="false" value="false" onClick={() => handleCheckboxClick('false')}/>False</label>
          </div>
          <div className='line3'>
            <button className='checkButton' onClick={() => checkColorAnswers(answer,id)}>Check</button>
          </div>
        </div>
      </div>
      {/*<button className='res' id="res" onClick={goBackToQuiz2}>Restart Quiz To Developer</button> */}
      <div className='third_line2'>
        <button className='save' id='save' onClick={exit}>Save</button>
        <button className='question2' id="question2" onClick={() => nextQuiz(ctx,id,setCurrentPage)}>Next Activity</button>
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


function exit(){
  window.close();
}
  
function nextQuiz(ctx,id,setCurrentPage){
 

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
  
      console.log("next:   ",data);
              
      // Handle the response data for the next quiz
      // You may want to update the state or perform other actions based on the response
      rememberTipologyQuiz = data.type;
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
  
  
  
  export default TrueFalseQuiz;

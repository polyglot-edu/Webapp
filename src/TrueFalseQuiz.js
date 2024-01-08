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

//console.log('rememberId:', rememberId);
//console.log('rememberLearningPath:', rememberLearningPath);

const apiQuizUrl = 'https://polyglot-api-staging.polyglot-edu.com/api/execution/next';

const rememberTipologyQuiz = urlParams.get('rememberTipologyQuiz');

let score = 0;

let colorright = "lightgreen";
let colorwrong = "lightcoral";


function TrueFalseQuiz(){
  score = 0;

  const [question, setQuestion] = useState('');//QUESTION VARIABLE
  const [answer, setAnswer] = useState('0');

  const [currentPage, setCurrentPage] = useState(() => {
    // Read current page form localStorage
    return localStorage.getItem('quiz4Page') || 'quiz4';
  });

  useEffect(() => {
    // Save current page in localStorage for all hthe change of page
    localStorage.setItem('quiz4Page', currentPage);

    restoreCheckboxState();
  }, [currentPage]);


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
setQuestion(data.firstNode.data.instructions);

setAnswer(data.firstNode.data.isQuestionCorrect);

 //take answer
 //setTipologyAnswer(data.firstNode.data.choices);

//setChoice(data.firstNode.data.isChoiceCorrect);

})
.catch(error => {
    console.error('Errore nella chiamata API:', error.message);
});

  const handleNextClick = () => {
    if(currentPage === 'quiz4'){
      setCurrentPage('inizioQuiz4');
    }else{
      if(currentPage === 'inizioQuiz4'){
        setCurrentPage('page2Quiz4');
      }
    }
  };

  const goBackToQuiz4 = () => {
    if(currentPage === 'inizioQuiz4'){
      setCurrentPage('quiz4');
    }else if (currentPage === 'page2Quiz4'){
      setCurrentPage('quiz4')
    }
  };

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
      checkbox.checked = !isDisabled; // Invert the value because we set the disable 
      checkbox.disabled = isDisabled;
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
    } else if (falsecheckCheck.checked && falsecheck === type) {
      score++;
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
    return inizioQuiz4(answer,question,goBackToQuiz4,handleNextClick,handleCheckboxClick,checkColorAnswers);
  }else if (currentPage === 'page2Quiz4'){
    return page2Quiz4(goBackToQuiz4);
  }
}

function inizioQuiz4(answer,question,goBackToQuiz4,handleNextClick,handleCheckboxClick,checkColorAnswers){

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
        <button className='question2' id="question2" onClick={handleNextClick}>Next Activity</button>
      </div>
    </div>
  );
}

function page2Quiz4(goBackToQuiz4){

    return(
        <div>
          <h1>ciao</h1>
          <button className='res' id="res" onClick={goBackToQuiz4}>Restart Quiz To Developer</button> 
          </div>
      )
}

function exit(){
    window.close();
  }
  
  function nextQuiz(){
    //here I take the next quiz
    //if the score is the same of the total answer i send success and go to next node
    //if i have node with more than one quiz i need to eìsend the score to the next page
  }
  
  
  
  export default TrueFalseQuiz;

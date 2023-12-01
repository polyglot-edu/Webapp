// Quiz2.js

import React, { useState, useEffect } from 'react';
import './Quiz2.css';

//variable to color the button
let colorright = "lightgreen";
let colorwrong = "lightcoral";
let score;
let isAnswerChecked = false;

function Quiz2() {

  score = 0;

  const [currentPage, setCurrentPage] = useState(() => {
    // Read current page form localStorage
    return localStorage.getItem('quiz2Page') || 'quiz2';
  });

  useEffect(() => {
    // Save current page in localStorage for all hthe change of page
    localStorage.setItem('quiz2Page', currentPage);
  }, [currentPage]);


  const handleNextClick = () => {
    if(currentPage === 'quiz2'){
      setCurrentPage('inizioQuiz2');
    }else{
      if(currentPage === 'inizioQuiz2'){
        setCurrentPage('page2Quiz2');
      }
    }
  };

  const goBackToQuiz2 = () => {
    if(currentPage === 'inizioQuiz2'){
      setCurrentPage('quiz2');
    }else if (currentPage === 'page2Quiz2'){
      setCurrentPage('quiz2')
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

  //to change the color when i check the answer
  const checkColorAnswers = () => {
    if (!isAnswerChecked) {
      isAnswerChecked = true;
      const correctCheckbox = document.querySelector('.correct');
      const incorrectCheckboxes = document.querySelectorAll('.start input[type="checkbox"]:not(.correct)');

      correctCheckbox.parentElement.style.backgroundColor = colorright;

      incorrectCheckboxes.forEach((checkbox) => {
        checkbox.parentElement.style.backgroundColor = colorwrong;
      });
    }
  };

  if (currentPage === 'quiz2') {
    return (
      <div className="Quiz2">
          <div className='first_line'>
            <img className="logo" src="https://i.postimg.cc/yNNSbWdG/logo-polyglot-1.png"></img>
          </div>
          <div className='second_line'>
            <h1 className="h1">Welcome on quiz2 with close question with tick!!</h1>
            <button className="startq" id='startq' onClick={handleNextClick}>
              Clicca qui per iniziare!
            </button>
          </div>
      </div>
    );
  } else if (currentPage === 'inizioQuiz2') {
    return inizioQuiz2(goBackToQuiz2,handleNextClick,handleCheckboxClick,checkColorAnswers);
  }else if (currentPage === 'page2Quiz2'){
    return page2Quiz2(goBackToQuiz2);
  }
}

function inizioQuiz2(goBackToQuiz2,handleNextClick,handleCheckboxClick,checkColorAnswers) {

  return (
    <div className="start">
      <div className='first_line'>
        <img className="logo" src="https://i.postimg.cc/yNNSbWdG/logo-polyglot-1.png"></img>
      </div>
      <div className= "second_line">
        <h1 className="q1">Geographic quiz</h1>
        <div className='q'>
          <button className="quest1">What is the German capital?</button>
        </div>
        <div className="startbutton">
          <div className='line1'>
          <label><input type="checkbox" className="w1" value="Rome" onClick={() => handleCheckboxClick('w1')} />Rome</label>
          <label><input type="checkbox" className="w2" value="Paris" onClick={() => handleCheckboxClick('w2')}/>Paris</label>
        </div>
        <div className="line2">
          <label><input type="checkbox" className="correct" value="Berlin" onClick={() => handleCheckboxClick('correct')}/>Berlin</label>
          <label><input type="checkbox" className="w3" value="Munchen" onClick={() => handleCheckboxClick('w3')}/>Munchen</label>
        </div>
        <div className='line3'>
          <button className='check' onClick={checkColorAnswers}>Check</button>
        </div>
        </div>
      </div>
      {/*<button className='res' id="res" onClick={goBackToQuiz2}>Restart Quiz To Developer</button> */}
      <div className='third_line'>
        <button className='save' id='save' onClick={exit}>Save and Exit</button>
        <button className='question2' id="question2" onClick={handleNextClick}>Next Activity</button>
      </div>
    </div>
  );
}

function page2Quiz2(goBackToQuiz2){
  return(
    <div>
      <h1>ciao</h1>
      <button className='res' id="res" onClick={goBackToQuiz2}>Restart Quiz To Developer</button> 
      </div>
  )
}

function exit(){
  window.close();
}


  //score++;


export default Quiz2;

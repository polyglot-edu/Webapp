
//import logo from './logo.svg'; to import imagine or file of this folder
import './App.css';
import React, { useEffect, useState } from 'react';//useless to use state in a functional component
import Quiz2f from './Quiz2.js';

const globalv = "ciao";//send the parameter by the webview like machinelearning
//when webview send to the backend what quiz must be open thwe webapp read to my api the name of the variable
//my react app see the variable and in base of the value he chose what page show on web app
let exportedComponent;//to know the quiz to open first
let score;//to remember the score of the quiz, this variable must be send to my api to upgrade the total score of my player

//variable to color the button
let colorright = "lightgreen";
let colorwrong = "lightcoral";

//this function need to be implemented to read the globalv from the api and decide what webapp to open
if (globalv === "ciao") {
  exportedComponent = App;
}else{
  if(globalv == "quiz2"){
    exportedComponent = Quiz2f;
  }
}


//First quiz
function App() {

  score = 0;//when i start the quiz score is 0

  //currentPage take trace regarding the current page
  //setCurrentPage is useless to change the page
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'App';
  });

  //when i do the quiz i need to remember the last page that i open 
  useEffect(() =>{
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);
  
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

  /*
  //remove the comment if you want to testing the movement in the different page
  const restartQuiz = () => {
    setCurrentPage('App');
  };
  */

  return (
    <div className="General">
      {currentPage === 'App' && (//if i am in currentPage == App
        <div className="App">
          <div className='first_line'>
            <img src="https://i.postimg.cc/YSBrNgTR/Logo.jpg"></img>
          </div>
          <div className='second_line'>
            <h1 className="h1">Welcome on the Geographic quiz</h1>
            <button className="next" id='next' onClick={nextPage}>
              Clicca qui per iniziare!
            </button>
          </div>
        </div>
      )}

      {currentPage === 'startQuiz' && <StartQuiz nextPage={nextPage} /*restartQuiz={restartQuiz}*/ />}
      {currentPage === 'GoQ2' && <GoQ2 /*restartQuiz={restartQuiz}*/ />}
    </div>
  );
}

//second page of first quiz
function StartQuiz({/*restartQuiz,*/ nextPage}) {
  const isCorrectButtonDisabled = localStorage.getItem('correctButtonDisabled') === 'true';

  return (
    <div className="start">
      <h1>What is the German capital?</h1>
      <div className="startbutton">
        <button className="w1" id="w1" onClick={Wrong}>Rome</button>
        <button className="w2" id="w2" onClick={Wrong}>Paris</button>
        <button className="correct" id="correct" onClick={Right} disabled={isCorrectButtonDisabled}>Berlin</button>
        <button className="w3" id="w3" onClick={Wrong}>Munchen</button>
      </div>
      {/*<button className='res' id="res" onClick={restartQuiz}>Restart Quiz To Developer</button> */}
      <button className='question2' id="question2" onClick={nextPage}>Next</button>
    </div>
  );
}

//third page of my first quiz
function GoQ2({/*restartQuiz*/}){
  return(
    <div>
      <h1>ciao</h1>
      {/*<button className='res' id="res" onClick={restartQuiz}>Restart Quiz To Developer</button> */}
      </div>
  )
}

//manage the wrong and right respond
function Wrong(){

  var rightb = document.getElementById('correct');
  rightb.disabled = true;
  var wrongb1 = document.getElementById('w1');
  var wrongb2= document.getElementById('w2');
  var wrongb3 = document.getElementById('w3');

  rightb.style.backgroundColor = colorright;
  wrongb1.style.backgroundColor = colorwrong
  wrongb2.style.backgroundColor = colorwrong
  wrongb3.style.backgroundColor = colorwrong

  localStorage.setItem('correctButtonDisabled', 'true');//disable the true button to avoid thata  player reload page and give the right response

  console.log(score);
}

//manage the wrong and right respond
function Right(){


  var rightb = document.getElementById('correct');
  rightb.disabled = true;
  var wrongb1 = document.getElementById('w1');
  var wrongb2= document.getElementById('w2');
  var wrongb3 = document.getElementById('w3');

  rightb.style.backgroundColor = colorright;
  wrongb1.style.backgroundColor = colorwrong
  wrongb2.style.backgroundColor = colorwrong
  wrongb3.style.backgroundColor = colorwrong

  score++;
  console.log(score);

  //save the state of correct button
  localStorage.setItem('correctButtonDisabled', 'true');//disable the button to avoid that a player reload page and click a lot of the button to increase his score

  
}

export default exportedComponent;//show the quiz that i select on my webview vscode
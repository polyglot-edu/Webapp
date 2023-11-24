import logo from './logo.svg';

import './App.css';
import React, { useEffect, useState } from 'react';//useless to use state in a functional component

const globalv = "ciao";//send the parameter by the webview
//when webview send to the backend what quiz must be open he send to my react the name of the variable
//my react app see the variable and in base of the value he chose what page shpw on web app
let i = 0;
let exportedComponent;
let score;
let colorright = "lightgreen";
let colorwrong = "lightcoral";

if (globalv === "ciao") {
  exportedComponent = App;
}

function App() {
  score = 0;
  //currentPage take trace regarding the current page
  //setCurrentPage is useless to change the page
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'App';
  });

  useEffect(() =>{
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);
  
  const nextPage = () => {
    if(i == 0){//to change easily the page of my quiz
      setCurrentPage('startQuiz');
    }
  };

  return (
    <div className="General">
      {currentPage === 'App' && (//if i am in currentPage == App
        <div className="App">
          <h1 className="h1">Welcome on the Geographic quiz</h1>
          <button className="next" id='next' onClick={nextPage}>
            Clicca qui per iniziare!
          </button>
        </div>
      )}

      {currentPage === 'startQuiz' && <StartQuiz />}
    </div>
  );
}

function StartQuiz() {
  return (
    <div className="start">
      <h1>What is the German capital?</h1>
      <div className="startbutton">
        <button className="w1" id="w1" onClick={Wrong}>Rome</button>
        <button className="w2" id="w2" onClick={Wrong}>Paris</button>
        <button className="correct" id="correct" onClick={Right}>Berlin</button>
        <button className="w3" id="w3" onClick={Wrong}>Munchen</button>
      </div>
    </div>
  );
}

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
}

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
  
}

export default exportedComponent;
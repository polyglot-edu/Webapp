import logo from './logo.svg';

import './App.css';
import React, { useState } from 'react';//useless to use state in a functional component

const globalv = "ciao";//send the parameter by the webview
//when webview send to the backend what quiz must be open he send to my react the name of the variable
//my react app see the variable and in base of the value he chose what page shpw on web app
let i = 0;
let exportedComponent;

if (globalv === "ciao") {
  exportedComponent = App;
}

function App() {
  const [currentPage, setCurrentPage] = useState('App');
  //currentPage take trace regarding the current page
  //setCurrentPage is useless to change the page

  const nextPage = () => {
    if(i == 0){//to change easily the page of my quiz
      setCurrentPage('startQuiz');
    }
  };

  return (
    <div class="General">
      {currentPage === 'App' && (//if i am in currentPage == App
        <div class="App">
          <h1 class="h1">Welcome on the Geographic quiz</h1>
          <button class="next" id='next' onClick={nextPage}>
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
      <h1>What is the Germany capital?</h1>
    </div>
  );
}

export default exportedComponent;
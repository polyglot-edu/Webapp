import React, { useState, useEffect } from 'react';
import './LessonText.css';


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

const apiQuizUrl = 'https://polyglot-api-staging.polyglot-edu.com/api/execution/first';

const rememberTipologyQuiz = urlParams.get('rememberTipologyQuiz');

let score = 0;

function LessonText(){

    const [text, setText] = useState('');//TEXT VARIABLE

    const [currentPage, setCurrentPage] = useState(() => {
        // Read current page form localStorage
        return localStorage.getItem('quiz5Page') || 'quiz5';
      });

    
    useEffect(() => {
        localStorage.setItem('quiz5Page',currentPage);
    },[currentPage]);


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
  
    //take the text
    setText(data.firstNode.data.text);
  
    })
    .catch(error => {
        console.error('Errore nella chiamata API:', error.message);
    });

    const handleNextClick = () => {
        if(currentPage === 'quiz5'){
          setCurrentPage('inizioQuiz5');
        }else{
          if(currentPage === 'inizioQuiz5'){
            setCurrentPage('Page2Quiz5');
          }
        }
      };

      const goBackToQuiz5 = () => {
        if(currentPage === 'inizioQuiz5'){
          setCurrentPage('quiz5');
        }else if (currentPage === 'Page2Quiz5'){
          setCurrentPage('quiz5')
        }
      };

      if (currentPage === 'quiz5') {
        return (
          <div className="LessonText">
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
      }else if (currentPage === 'inizioQuiz5') {
        return inizioQuiz5(goBackToQuiz5,handleNextClick,text);
      }else if (currentPage === 'Page2Quiz5'){
          return Page2Quiz5(goBackToQuiz5);
      }
}

function inizioQuiz5(goBackToQuiz5,handleNextClick,text){

    return(
        <div className = 'start' id='start'>
            <div className='first_line2'>
                <img className="logo" src="https://i.postimg.cc/yNNSbWdG/logo-polyglot-1.png"></img>
            </div>
            <div className= "second_line2">
                <h1 className="q1">{rememberLearningPath} Theory</h1>
                <div className='q'>
                    <p className="text1">{text}</p>
                </div>
            </div>
            <div className='third_line2'>
              <button id="Exit" className='Exit' onClick={exit}>Save and Exit</button>
              <button id='Next2' className='Next2' onClick={handleNextClick}>Next Activity</button>
            </div>
        </div>
    );
}

function Page2Quiz5(goBackToQuiz5){

    return(
        <div>
          <h1>ciao</h1>
          <button className='res' id="res" onClick={goBackToQuiz5}>Restart Quiz To Developer</button> 
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

export default LessonText;
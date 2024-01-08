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

//console.log('rememberId:', rememberId);
//console.log('rememberLearningPath:', rememberLearningPath);

const apiQuizUrl = 'https://polyglot-api-staging.polyglot-edu.com/api/execution/next';

const rememberTipologyQuiz = urlParams.get('rememberTipologyQuiz');

let numberOfWords;
var quantityAnswerAsString;
var isCorrect1;

let score = 0;

function OpenQuest(){

    const [question, setQuestion] = useState('');//QUESTION VARIABLE
    const [quantityAnswer, setQuantityAnswer] = useState(0);//QUANTITY OF ANSWER IN MY QUIZ
    const [tipologyAnswer, setTipologyAnswer] = useState(1);
    //const [choice, setChoice] = useState(2);

    const [currentPage, setCurrentPage] = useState(() => {
      // Read current page form localStorage
      return localStorage.getItem('quiz3Page') || 'quiz3';
    });

    const [isButtonCheckDisabled, setIsButtonCheckDisabled] = useState(() => {
      return localStorage.getItem('isButtonCheckDisabled') === 'true';
    });


    useEffect(() => {
      localStorage.setItem('quiz3Page',currentPage);
      localStorage.setItem('isButtonCheckDisabled', isButtonCheckDisabled);
    },[currentPage,isButtonCheckDisabled]);

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
    setQuestion(data.firstNode.data.question);
  
     //take answer
     //setTipologyAnswer(data.firstNode.data.choices);
  
    //take number of answer
    setQuantityAnswer(data.firstNode.data.correctAnswers);
    quantityAnswerAsString = String(quantityAnswer);
    var rememberWords = quantityAnswerAsString.split(' ');
    numberOfWords = rememberWords.length;
    //setChoice(data.firstNode.data.isChoiceCorrect);
  
    })
    .catch(error => {
        console.error('Errore nella chiamata API:', error.message);
    });

      const handleNextClick = () => {
        if(currentPage === 'quiz3'){
          setCurrentPage('inizioQuiz3');
        }else{
          if(currentPage === 'inizioQuiz3'){
            setCurrentPage('Page2Quiz3');
          }
        }
      };

      const goBackToQuiz3 = () => {
        if(currentPage === 'inizioQuiz3'){
          setCurrentPage('quiz3');
        }else if (currentPage === 'Page2Quiz3'){
          setCurrentPage('quiz3')
        }
      };
    

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
        return inizioQuiz3(goBackToQuiz3,handleNextClick,question,tipologyAnswer,setIsButtonCheckDisabled,isButtonCheckDisabled);
      }else if (currentPage === 'Page2Quiz3'){
          return Page2Quiz3(goBackToQuiz3);
      }
}

function inizioQuiz3(goBackToQuiz3,handleNextClick,question,tipologyAnswer,setIsButtonCheckDisabled,isButtonCheckDisabled) {

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
              <button id='Next2' className='Next2' onClick={handleNextClick}>Next Activity</button>
            </div>
        </div>
    );
}

function Page2Quiz3(goBackToQuiz3){
  return(
    <div>
      <h1>ciao</h1>
      <button className='res' id="res" onClick={goBackToQuiz3}>Restart Quiz To Developer</button> 
      </div>
  )
}

function saveText(setIsButtonCheckDisabled){
  var insertText = document.getElementById("areaOfText").value;
  if(insertText === quantityAnswerAsString){
    isCorrect1 = 'Your answer is right';
    document.getElementById("resp").style.color = 'green';
    score++;
    console.log(score);
  }else{

    isCorrect1 = 'Your answer is wrong';
    document.getElementById("resp").style.color = 'red';
  }

  setIsButtonCheckDisabled(true);
}

function exit(){
  window.close();
}

function nextQuiz(){
  //here I take the next quiz
  //if the score is the same of the total answer i send success and go to next node
  //if i have node with more than one quiz i need to eìsend the score to the next page
}



export default OpenQuest;
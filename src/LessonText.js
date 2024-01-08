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

const apiQuizUrl = 'https://polyglot-api-staging.polyglot-edu.com/api/execution/next';

const rememberTipologyQuiz = urlParams.get('rememberTipologyQuiz');

let score = 0;

let rememberQuizToSend;

function LessonText(){

    const [text, setText] = useState('');//TEXT VARIABLE
    const [ctx, setCtx] = useState('0');
    const [id, setId] = useState('1');
    const [nextQuizType, setNextQuizType] = useState('2');

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
    setCtx(data.ctx);
    setId(data.firstNode.validation);
    //const ciao = id[0].id;
    //console.log(ciao);
    
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
        return inizioQuiz5(goBackToQuiz5,handleNextClick,text,ctx,id,setNextQuizType,nextQuizType);
      }/*else if (currentPage === 'Page2Quiz5'){
          return Page2Quiz5(goBackToQuiz5);
      }*/
}

function inizioQuiz5(goBackToQuiz5,handleNextClick,text,ctx,id,setNextQuizType,nextQuizType){

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
              <button id='Next2' className='Next2' onClick={() => nextQuiz(ctx,id,setNextQuizType,nextQuizType)}>Next Activity</button>
            </div>
        </div>
    );
}

/*function Page2Quiz5(goBackToQuiz5){

    return(
        <div>
          <h1>ciao</h1>
          <button className='res' id="res" onClick={goBackToQuiz5}>Restart Quiz To Developer</button> 
          </div>
      )
}*/

function exit(){
    window.close();
  }
  
  function nextQuiz(ctx,id,setNextQuizType,nextQuizType){

    console.log("next quiz");
          console.log(id[0].id);
          console.log(ctx);
        
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
            // Handle the response data for the next quiz
            // You may want to update the state or perform other actions based on the response
            console.log('Next quiz data received:', data);

            setNextQuizType(data.type);
            console.log("type",nextQuizType);
            //setEXport(nextQuizType);
            rememberQuizToSend = nextQuizData;
            window.location.href = `http://127.0.0.1:3000`;

          })
          .catch((error) => {
            console.log("i am here next");
            console.error('Error in the nextQuiz request:', error.message);
            console.error('Dettagli dell\'errore:', error);
          });
  
  }

export default LessonText;
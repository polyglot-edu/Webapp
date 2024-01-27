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

//Api to take the info about the next and current quiz
const apiQuizUrl = 'https://polyglot-api-staging.polyglot-edu.com/api/execution/next';

//to save and send the type of the next quiz
let rememberTipologyQuiz = urlParams.get('rememberTipologyQuiz');

//to send a variabile when i pass to the next page --> usefull to take the correct info to the API
let next = true;

//function that is launch 
function LessonText(){

    const [text, setText] = useState('');//TEXT VARIABLE
    const [ctx, setCtx] = useState('0');//CTX VARIABLE
    const [id, setId] = useState('1');//ID VALIDATION VARIABLE
    const [nextQuizType, setNextQuizType] = useState('2');//NEXT QUIZ TYPE VARIABLE
    const [platform, setPlatform] = useState('3');

    //To remember what page is the last //this operation is important that it is on api
    const [currentPage, setCurrentPage] = useState(() => {
        // Read current page form localStorage
        return localStorage.getItem('quiz5Page') || 'inizioQuiz5';
      });

    //remember the last page and set it
    useEffect(() => {
        localStorage.setItem('quiz5Page',currentPage);
    },[currentPage]);

    //if in the Url there is the parameter with next i take the information to the api in this way
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

        setText(data.data.text);
        setCtx(urlParams.get('ctx'));
        setId(data.validation)
        setPlatform(data.platform);
        

      })
      .catch((error) => {
        console.error('Error in the nextQuiz request:', error.message);
        console.error('Dettagli dell\'errore:', error);
      });
    }else{//if i am in the first node of the flow

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

        //take the text
        setText(data.firstNode.data.text);
        setCtx(data.ctx);
        setId(data.firstNode.validation);
        setPlatform(urlParams.get('rememberTypeQuiz'));  
    })
    .catch(error => {
        console.error('Errore nella chiamata API:', error.message);
        console.log("bho");
    });
  }

  //to change the page in base of what is the current page --> function called to understand what is the next page 
  const handleNextClick = () => {
      if(currentPage === 'quiz5'){
        setCurrentPage('inizioQuiz5');
      }else{
        if(currentPage === 'inizioQuiz5'){
          setCurrentPage('NextVs');
        }
      }
    };

    //function used only to check if all the pages do their job
    /*
    const goBackToQuiz5 = () => {
      if(currentPage === 'inizioQuiz5'){
        setCurrentPage('quiz5');
      }else if (currentPage === 'NextVs'){
        setCurrentPage('quiz5')
      }
    };
    */

    if(currentPage === 'quiz5') {
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
      return inizioQuiz5(/*goBackToQuiz5,*/text,ctx,id,setNextQuizType,nextQuizType,platform,handleNextClick);
    }else if (currentPage === 'NextVs'){
      return NextVs(/*goBackToQuiz5*/);
    }
}

//second page
function inizioQuiz5(/*goBackToQuiz5,*/text,ctx,id,setNextQuizType,nextQuizType,platform,handleNextClick){

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
              <button id='Next2' className='Next2' onClick={() => nextQuiz(ctx,id,setNextQuizType,nextQuizType,platform,handleNextClick)}>Next Activity</button>
            </div>
        </div>
    );
}

//function to save the last page that i see and exit
function exit(){
  window.close();
}

//third page called only if the next node is for VsCode platform
function NextVs(/*goBackToQuiz6*/){

  return(
    <div>
      <h1>Go back to Vscode and click there the button next to continue the Flow</h1>
    </div> 
  )
  //<button onClick={goBackToQuiz5}>return</button>   //DON'T CANCEL BECAUSE YOU CAN USE TO SEE IF ALL GO OK
}
 
//function to understand if i need to open VsCode node so calling NextVs or if next node is for WebApp so I open the next WebApp node
function nextQuiz(ctx,id,setNextQuizType,nextQuizType,platform,handleNextClick){
  
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
            
    // Handle the response data for the next quiz
    // You may want to update the state or perform other actions based on the response

    rememberTipologyQuiz = data.type;//need to repair this line
    
    let id_i = id[0].id;

    if(platform === 'WebApp'){
    
      //window.location.href = `https://polyglot-webapp.polyglot-edu.com/?rememberId=${encodeURIComponent(rememberId)}&rememberLearningPath=${encodeURIComponent(rememberLearningPath)}&rememberTipologyQuiz=${encodeURIComponent(rememberTipologyQuiz)}&next=${encodeURIComponent(next)}&ctx=${encodeURIComponent(ctx)}&id_i=${encodeURIComponent(id_i)}`;
    }else{
    
      handleNextClick();
    }
  })
  .catch((error) => {
    console.error('Error in the nextQuiz request:', error.message);
    console.error('Dettagli dell\'errore:', error);
  });
}

export default LessonText;
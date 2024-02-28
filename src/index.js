import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import OpenQuest from './OpenQuest';
import TrueFalseQuiz from './TrueFalseQuiz';
import reportWebVitals from './reportWebVitals';
import WatchVideo from './WatchVideo';
import ReadMaterial from './ReadMaterial'
import Summary from './Summary';

//I take the data to understand what is the first page to open
const urlParams = new URLSearchParams(window.location.search);
const rememberTipologyQuiz = urlParams.get('rememberTipologyQuiz');
let globalv = rememberTipologyQuiz;
console.log(globalv);

//in base of the value of globav I open a page
if (globalv === "multipleChoiceQuestionNode") {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    // take current URL 
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
}else{
  if(globalv === "closeEndedQuestionNode"){
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
    // take current URL 
      <React.StrictMode>
        <OpenQuest />
      </React.StrictMode>
    );
  }else{
    if(globalv === "TrueFalseNode"){
      const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
    // take current URL 
      <React.StrictMode>
        <TrueFalseQuiz />
      </React.StrictMode>
    );
      }else{
        if(globalv === "WatchVideoNode"){
          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(
            // take current URL 
              <React.StrictMode>
                <WatchVideo />
              </React.StrictMode>
            );
        }else{
          if(globalv === "ReadMaterialNode"){
            const root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(
            // take current URL 
              <React.StrictMode>
                <ReadMaterial />
              </React.StrictMode>
            );
          }else{
            if(globalv === "SummaryNode"){
              const root = ReactDOM.createRoot(document.getElementById('root'));
              root.render(
              // take current URL 
                <React.StrictMode>
                  <Summary />
                </React.StrictMode>
              );
            }
          }
        }
      }
    }
  }






// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


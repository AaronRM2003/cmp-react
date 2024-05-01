import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';

import reportWebVitals from './reportWebVitals';
 
/*function Change(){
   const s={
        c: 0
    }

     i = () =>{
        this.setState({c:this.s.c +1});
 return (
        <div>
          <p>{this.s.c}</p>
        <button Onclick={this.i}>c</button>
        </div>
 );
    }
    }*/



//import Counter from './app1';
var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <React.StrictMode>
  
 
    <App />

    </React.StrictMode>
  
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
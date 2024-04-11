import React, { useState, useEffect } from 'react';
import "./App.css"
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import {FaBook,FaPen, FaHome,FaArrowCircleLeft} from 'react-icons/fa'
import axios from 'axios'

var b = true;
function CTProfile(){

    const [data,setData] = useState(null);
    const [submitted,setSubmitted] = useState(true);
    const [subject,setSubject] = useState('');
    const [fname,setFname] = useState('');
    const [mname,setMname] = useState('');
    const [phone,setPhone] = useState('');
  
    function gohome(){
        window.location.href='./TProfile';
    }
    
    const isDesktop = !/Mobi|Android/i.test(navigator.userAgent);
    if(localStorage.getItem("token1")){
      let intervalId = setInterval(() => {
        const currentDate = Date.now();
        const data = localStorage.getItem("token1");
        const datenow = localStorage.getItem("datenow");
        const decodedToken = jwtDecode(data);
        console.log(decodedToken.exp);
        if(decodedToken.exp*1000 < currentDate-datenow && b){
            alert('Session Timeout\nRedirecting to login page');
            navigate('/pages/Form', { replace: true });
            window.location.href='./Form';
            b=false;
            clearInterval(intervalId); // Clear the interval
        }
    }, 1 * 10000);
    }
    else{
      window.location.href='./Form';
    }
    const navigate = useNavigate();
    function sub(event){
        event.preventDefault();
    }

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("http://localhost:3001/api/student");
            const data = await response.json();
            setData(data);
        }
        fetchData();
    }, []);
    
    function submit(event){

        event.preventDefault();
       
            if(subject && fname && mname && phone){
                if(window.confirm("Are you ready to submit?")){
            axios.post("http://localhost:3001/tprof", { subject,fname,mname,phone }).then((response) => {
                   
               setSubmitted(false);
            })
                .catch((error) => {
                    alert(error.response.data.message );
                    console.log(error.response.data.message);
                   
            });
        }
     
        }   else{
            alert("Please fill all details!");
        }
    }

    return <div className="c"> 
     <h1>PROFILE</h1>
    {submitted? <div>
        <div>
   
     <div className={isDesktop ? "row" : "rowm"}>
   
    <div className='cont'> 
     <form onSubmit={sub}>
     <h2>Your Subject:</h2>
      <input
        className="formm"
        type="username"
        placeholder="Subject"
        value={subject}
        onChange={(event) => setSubject(event.target.value)}
      />


    </form>
    </div>
    <div className='cont'> 
    <form onSubmit={sub}>
        <h2>Fathers Name:</h2>
      <input
        className="formm"
        type="username"
        placeholder="Fathers Name"
        value={fname}
        onChange={(event) => setFname(event.target.value)}
      />

    
    </form>
    </div>
    </div>
    <div className={isDesktop ? "row" : "rowm"}>
        <div className='cont'>  
  <form onSubmit={sub}>
    <h2>mothers Name:</h2>
      <input
        className="formm"
        type="username"
        placeholder="Mothers Name"
        value={mname}
        onChange={(event) => setMname(event.target.value)}
      />

    
    </form>
    </div>
    <div className='cont'>  
    <form onSubmit={sub}>

    <h2>Phone Number:</h2>
      <input
        className="formm"
        type="username"
        placeholder="Phone Number"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
      />

    

    

    
    </form>
    </div>
</div>
</div>
<div >
    <button className={isDesktop ? "b1" : "b"}
                    onClick={submit}
            ><FaPen/>SUBMIT</button>
   
   </div>
   </div>:<div>
    <h2>Submitted...</h2>
   <button className={isDesktop ? "b1" : "b"}
                    onClick={()=>setSubmitted(true)}
            >GO BACK</button>
    </div>}
   
     <div className="d">
                 <button className={isDesktop ? "B1" : "B"}
                     onClick={gohome}
                                 > BACK</button>
                 </div>
    
        </div>



}

export default CTProfile;
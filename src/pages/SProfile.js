import React, { useState, useEffect } from 'react';
import "./App.css"
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import {FaBook,FaPen, FaHome,FaArrowCircleLeft,FaSortDown} from 'react-icons/fa'
import axios from 'axios'


var b = true;

 function SProfile() {
  const [show,setShow] = useState(true);
  const [show1,setShow1] = useState(false);
  const [npass, setNpass] = useState('');
    const [cpass, setCpass] = useState('');
    const [isClicked, setIsClicked] = useState(false);

    function Assig() {
        setIsClicked(true);
        window.location.href = "./Assignments";
    }
    function Sess() {
        setIsClicked(true);

        window.location.href = "./Sessionals";
    }
    function Cprofile(){
        setIsClicked(true);

        window.location.href = "./CSProfile";
    }
    function sub(event){
        event.preventDefault();
    }
    function submitpass(event){

        event.preventDefault();
        if(npass && cpass){
        if(npass === cpass){
          if(window.confirm("Are you ready to Submit?")){
            setShow(true);
            axios.post("https://cmp-server.onrender.com/changepass",{cpass}).then((response)=>{
              alert("Password Changed. Going back to login page");
              navigate('/pages/Form', { replace: true });
            }) .catch((error) => {
  
                      alert(error.response.data.message );
                      console.log(error.response.data.message);
                     
              });
          }
  
        }
        else{
          alert("Passwords dont match");
        }
      }
      else{
        alert("Please enter passwords before submit");
      }
      }
    const [t,setT]= useState(true);
    useEffect(() =>{
        if(localStorage.getItem('token1')=== null){
            setT(false);
        }
    });
       const navigate = useNavigate();
    useEffect(() => {
        try{
        const fetchData = async () => {
            const response = await fetch("https://cmp-server.onrender.com/api/student");
            const data = await response.json();
            setData(data);
        }
        fetchData();
    }catch (error) {
        console.error('An error occurred:', error);
      }

        if (localStorage.getItem("token1")) {
            let intervalId = setInterval(() => {
                const currentDate = Date.now();
                const data = localStorage.getItem("token1");
                const datenow = localStorage.getItem("datenow");
                const decodedToken = jwtDecode(data);
                console.log(decodedToken.exp);
                if(decodedToken.exp*1000 < currentDate-datenow && b){
                    alert('Session Timeout\nRedirecting to login page');
                    navigate('/pages/Form', { replace: true });
                    b=false;
                    clearInterval(intervalId); // Clear the interval
                }
            }, 1 * 10000); // Check every second

            // Clear interval on unmount
            return () => clearInterval(intervalId);
        } else {
            navigate('/pages/Form', { replace: true });
        }
    }, [navigate]);
  
 
    function gohome(){
        navigate('/', { replace: true });
    }
    function Anim(event){
      event.preventDefault();
      setShow1(true);
      setTimeout(() => {
        setShow(true);
        setShow1(false);
      }, 500);
    }
  /*  useEffect(() => {
        const timer = setTimeout(() => {
            // Navigate to a new page and clear the history stack
            alert('Session Timeout\nRedirecting to login page');

            navigate('/pages/Form', { replace: true });
            window.location.reload();
        }, 600000); // 10 minutes in milliseconds

        return () => clearTimeout(timer);
    }, []);
*/const auth = {
    isAuthenticated: true,
    logout(cb) {
      this.isAuthenticated = false;
      setTimeout(cb, 100); // fake async
    }
  };
    const [data, setData] = useState(null);
    const isDesktop = !/Mobi|Android/i.test(navigator.userAgent);
   
 
  
    function handleSubmit(event) {
        event.preventDefault();
            window.location.href = "./Attendance";

    }
  
    return<div className='container-fluid'>
        <div className={isClicked? 'Box':""}></div>
        {t?   <div className="c">
   {  auth.isAuthenticated ? <div>
    <button className={isDesktop ? "B1" : "B"}
      onClick={() => {
        auth.logout(() => {
        navigate('/pages/Form');
          // Clear your session as needed here.
          // If you're using Redux or Context API, you can dispatch a logout action.
          // To clear the session storage: sessionStorage.clear();
         localStorage.removeItem('token1');
          // To clear the cookies: document.cookie.split(";").forEach((c) => { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
        });
      }}
    >
      <FaArrowCircleLeft/>   LOG OUT
    </button>
    </div>: <div className='c'>
    You are not logged in.
  </div>
  }
    
    
        <h2 className={isDesktop ? "attcont3" : "attcont2"}>WELCOME  {data ? data.name : <div className='loader1'></div>}</h2>
        <div className={isDesktop ? "attcont3" : "attcont2"} >
            <h2 >ABOUT</h2>
            <p className="container">NAME : {data ? data.name :<div className='loader1'></div>}</p>
            <p className="container">ROLL NO : {data ? data.rollno :<div className='loader1'></div>}</p>
            <p className="container">PHONE : {data ? data.phone : <div className='loader1'></div>}</p>
            <p className="container">FATHER'S NAME : {data ? data.fathersname : <div className='loader1'></div>}</p>
            <p className="container">MOTHER'S NAME : {data ? data.mothersname : <div className='loader1'></div>}</p>
          <button  className={isDesktop ? "b1" : "b"} 
                    onClick={Cprofile}
                ><FaPen/> COMPLETE YOUR PROFILE</button>
                
        </div>

        <div  >
           
        <div >
                <button  className={isDesktop ? "b1" : "b"} 
                    onClick={handleSubmit}
                ><FaBook/> ATTENDANCE</button>
              
        </div>
            <div>
                <button  className={isDesktop ? "b1" : "b"}
                    onClick={Assig}
            > <FaPen/>ASSIGNMENTS</button>
        </div>
        <div>
                <button className={isDesktop ? "b1" : "b"}
                    onClick={Sess}
            ><FaPen/>SESSIONALS</button>
        </div>
           

        </div>
        <div>
        <div style={{alignItems:'center',display:'flex',flexDirection:'column'}}>
      <h2>Change Password</h2>
      {show &&
      <button
      className={isDesktop ? "b1" : "b"}
      onClick={() => setShow(false)}
    >
      Change Password <FaSortDown/>
    </button>
}
     {!show && <div className={(show1 && "close-animation")}><div className= {(!show1 && "dropdown-animation")} style={{display:'flex',flexDirection:'column',alignItems:'center'}}> <div className={isDesktop ? "row" : "rowm"}>
    <div className='cont'>
      <form onSubmit={sub}>
        <h2>New Password</h2>
        <input
          className="formm"
          type="password"
          placeholder="New password"
          value={npass}
          onChange={(event) => setNpass(event.target.value)}
          required
        />
      </form>
    </div>
    <div className='cont'>
      <form onSubmit={sub}>
        <h2>Confirm Password</h2>
        <input
          className="formm"
          type="password"
          placeholder="Confirm password"
          value={cpass}
          onChange={(event) => setCpass(event.target.value)}
          required
        />
      </form>
    </div>
  
   </div>
   <button className={isDesktop ? "b1" : "b"}  style={isDesktop?{width:'40%'}:{}} onClick={(event)=>{submitpass(event)}}
                                    ><FaPen/> SUBMIT</button>
    <button
      className={isDesktop ? "b1" : "b" }  
      onClick={(event) => Anim(event)}
      style={{backgroundColor:'lightblue',width:'40%'}}
    >
    GO BACK
    </button></div> </div>}
    </div>
        </div>
        <div className="d">
             <button className={isDesktop ? "B1" : "B"}
                 onClick={gohome}
                             ><FaHome/> HOME</button>
             </div>
             </div>
 :<div className='c' >YOU ARE LOGGED OUT</div>
   }
    </div>


}
export default SProfile;

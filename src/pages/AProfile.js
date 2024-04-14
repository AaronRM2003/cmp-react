import React, { useState, useEffect } from 'react';
import "./App.css"
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import {FaTimes,FaMinusCircle,FaSortDown,FaArrowCircleLeft,FaPen} from 'react-icons/fa'
import axios from 'axios'
import * as XLSX from 'xlsx';


var b = true;

function AProfile(){
    const [t,setT]= useState(true);
    useEffect(() =>{
        if(localStorage.getItem('token1')=== null){
            setT(false);
        }
    });
    const [selectDept,setSelectedDept] = useState({});

    let val = Object.keys(selectDept).length;
    const [adddep,setAdddep] = useState(true);
    const [addusers,setAddusers] = useState(true);
    const [stops,setStops] = useState(true);
    const [showdep,setShowdep] = useState(false);
    const [show,setShow] = useState(true);
    const [show1,setShow1] = useState(false);  
    const [str,setStr] = useState('');
    const isDesktop = !/Mobi|Android/i.test(navigator.userAgent);
    const [data,setData] =useState(null);
    const [all,setAll] =useState(null);
    const [dept,setDept] = useState('');
    const [name,setName] = useState('');
    const [username,setUsername] = useState('');
    const [pass,setPass] = useState('');
    const [input,setInput] = useState('');
    const [pos ,setPos]= useState('');
    const [clas,setClas]= useState('');
    const [removedep,setRemovedep] = useState(true);
    const [arr,setArray] = useState('');
    const [load, setLoad] = useState(false);
    const [notify, setNotify] = useState(true);
    const [file,setFile] = useState(null);
    const [date3,setData3] = useState(new Date());
    const [jsonData, setJsonData] = useState(null);
    const [showxl,setShowxl] = useState(false);

    function Anim(event){
      event.preventDefault();
      setShow1(true);
      setTimeout(() => {
        setShowdep(prevShowatt => !prevShowatt);
        setShow1(false);
      }, 500);
    }
  
    const navigate = useNavigate();
    const auth = {
        isAuthenticated: true,
        logout(cb) {
          this.isAuthenticated = false;
          setTimeout(cb, 100); // fake async
        }
      };
      const handleaddDept =  (event) => {
        event.preventDefault();
        if(dept){
        const newSelectDept = [
          ...selectDept,
           dept,
        ];
       const d=dept;
        // Update the state
        setSelectedDept(newSelectDept);
      
        if (window.confirm("Do you want to continue?")) {
       
         

         axios.post("https://cmp-server.onrender.com/adddept", {d}).then((response) => {
               
           
        })
            .catch((error) => {
                alert(error.response.data.message );
                console.log(error.response.data.message);
               

        });
      
        setAdddep(true);
    }
  
  }  else{
    alert("Please add a valid name");
  }
    
      };
    async  function stop(event){
        event.preventDefault();
        
        if(window.confirm("ARE YOU SURE ?")){
        const response = await fetch("https://cmp-server.onrender.com/wait");
        const data = await response.json();
        if(response){
        alert(data.message);
        setStops(false);
      }
    }
      }
      async  function resume(event){
        event.preventDefault();
        
        if(window.confirm("ARE YOU SURE ?")){
        const response = await fetch("https://cmp-server.onrender.com/set");
        const data = await response.json();
        if(response){
        alert(data.message);
        setStops(true);
        }
      }
      }
      
        
      
      
      const handleaddusers = (item,event) => {
        event.preventDefault();
       if(username && name && (pass && pos)&& clas ){
        if (window.confirm(" Do you want to continue?")) {
       
        axios.post("https://cmp-server.onrender.com/adduser", { username, pass,pos,clas,name,item }).then((response) => {
       
         
        
         alert(response.data.message);  


      })
          .catch((error) => {
              alert(error.response.data.message );
              console.log(error.response.data.message);

      });
    }
       }
       else{
        alert('please fill all details');
       }
     
        setAddusers(true);
      };
      function sub(event){
        event.preventDefault();
      }
      useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("https://cmp-server.onrender.com/api/alltotal");
            const data = await response.json();
            setAll(data);
        }
        fetchData();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("https://cmp-server.onrender.com/api/student1");
            const data = await response.json();
            if(data){
            setData(data);
           
            if (data.depts && Array.isArray(data.depts.dept)) {
              setSelectedDept(data.depts.dept);
          }
        }
        
        
      }
        fetchData();
        const fetchD = async () => {
          const response = await fetch("https://cmp-server.onrender.com/get");
          const data = await response.json();
         
          setStops(data);
        
      }
      fetchD();
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
    




    const pro = (data,dep) => {
        if (!data) return [];
    let result = data.filter(item => item.dep === dep)
    .map(item => ({pos:item.pos, name: item.name, class: item.class, phone: item.phone }));
    
   return result;
       
    }
    async function showdepp(i){
      if(!removedep){
        if(window.confirm("Are you sure you want to remove this Department?")){
          const it = i;
          if(Object.keys(selectDept).length!==0){
            
          const arr = selectDept.find(item => item === i);
          console.log(arr);
          setSelectedDept(selectDept.filter(item => item !== i));
          
           axios.post("https://cmp-server.onrender.com/removeDept",{arr}).then((response) =>{
            
            alert("Department Removed");
           }).catch((error) => {
            alert(error.response.data.message );
            console.log(error.response.data.message);
           

    });
        }
      }}
      else{
        setStr(i);
        setShowdep(prevShowatt => !prevShowatt);
      }
    }
    const dep = (data)=>{
        if (!data) return [];
        let result = []
        for (let s in data){
            result.push(data[s]);
        } 
        return result;
    }
    const submitFile = async (event) => {
      event.preventDefault();
      setLoad(true);
      const formData = new FormData()
      formData.append('file', file);
      await axios.post('https://cmp-server.onrender.com/pdfnotify', formData, {
        
        headers: {
          'Content-Type': 'multipart/form-data',
          
        }
        
      }).then((response)=> {
        setLoad(false);
           alert("submitted");
  
      }).catch((error) => {
        alert(error.response.data.message );
        console.log(error.response.data.message);
  });
    };
    const handleFileUpload = (event) => {
      setFile(event.target.files[0]);
    };
    const handleChange = (event) => {
      setInput(event.target.value);
    };
    function handleattsheet(event){
      event.preventDefault();
    
     if(jsonData){
      if(window.confirm("Are you ready to continue?")){
      axios.post("https://cmp-server.onrender.com/updateusers", {jsonData }).then((response) => {
        setLoad(true);
     
      if(response.data.message==='success'){
      }
          alert("Submitted");

      })
          .catch((error) => {
            setLoad(false);

              alert(error.response.data.message );
              console.log(error.response.data.message);
      });
      }
      else{
          alert('Attach the excel file');
      }
    }
  }
    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setJsonData(JSON.stringify(jsonData));

      };
      
      reader.readAsArrayBuffer(file);
     

      
    };
    function inputnotify(event){
      event.preventDefault();
      if(input){
        if(window.confirm("Are you sure, you want to send the notification?")){
          let date1 = new Date();
          let date2 = date1.toLocaleDateString('en-IN') + " " + date1.toLocaleTimeString();
          date2 = new Date().toLocaleDateString('en-IN') + " " + new Date().toLocaleTimeString();
         setData3(date2);
         const date = date2;
          axios.post("https://cmp-server.onrender.com/notify",{input,date}).then((response) =>{

           alert("Notification Sent");
           }).catch((error) => {
            alert(error.response.data.message );
            console.log(error.response.data.message);
           

    });
        }
      }

    }

      return <div>
      {t?   <div className="c">
      { load &&
    <div className='loader1'></div>
}
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
  
  
      <h2 className={isDesktop ? "attcont3" : "attcont2"}>WELCOME  ADMIN : {data ? data.name : 'Loading...'}</h2>
      <div className={isDesktop ? "attcont3" : "attcont2"}>
          <h2 >ABOUT</h2>
          <p className="container">NAME : {data ? data.name : 'Loading...'}</p>
          <p className="container">ROLL NO : {data ? data.rollno : 'Loading...'}</p>
          <p className="container">PHONE : {data ? data.phone : 'Loading...'}</p>
          <p className="container">FATHER'S NAME : {data ? data.fathersname : 'Loading...'}</p>
          <p className="container">MOTHER'S NAME : {data ? data.mothersname : 'Loading...'}</p>
         </div>
      <h1>NOTE:</h1>
      <p>You are the admin of this portal, you have control over the server and can edit profiles and can send notifications. So, be responsible of whatever changes you make here and please contact the developers for any issues.</p>
      <h1>DEPARTMENTS</h1>
      <div  >
      
       
         
       { dep(selectDept).map((item, index) => (
  <div  key={index}>
    <div>
      {!showdep && notify? <div className={show && "dropdown-animation"}>
    <button
      className={isDesktop ? "b1" : "b"}
      onClick={() => showdepp(item)}
    >
     {item}  {removedep && <FaSortDown/>} {!removedep && <FaMinusCircle/>}
    </button></div>:<div> </div>}
    </div>
    {showdep && str === item &&  (
      <div  className={(show && "dropdown-animation")}>
        <div  className={(show1 && "close-animation")}>
        <h2>{item}</h2>
        <ul>
{
    ['teacher', 'student'].map((type) => (
        <>
            <h2>{type.charAt(0).toUpperCase() + type.slice(1)}s</h2>
            {pro(all, item).filter(person => person.pos === type).map((person,index) => (
                 <li className={isDesktop ? "attcont1" : "attcont"}> Name: { person.name} Class: {person.class} Phone: {person.phone}</li>
            ))}
        </>
    ))
}
</ul>

      </div></div>
    )}
   
 
 {showdep && str===item? <div>
  {addusers ? (
  <div className={(show && "dropdown-animation")}>
    <button
      className={isDesktop ? "b1" : "b"}
      onClick={() => setAddusers(false)}
    >
      ADD USERS +
    </button>
  </div>
) : (
  <div>
{ <div className={(show && "dropdown-animation")}>
    <form onSubmit={sub}>
      <input
        className="form"
        type="username"
        placeholder="Add Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

    
    </form>
    <form onSubmit={sub}>
      <input
        className="form"
        type="username"
        placeholder="Username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />

    
    </form>
    <form onSubmit={sub}>
      <input
        className="form"
        type="username"
        placeholder="Password"
        value={pass}
        onChange={(event) => setPass(event.target.value)}
      />

    
    </form>

     <select style={{width:'90%',height:'60px',borderRadius:'20px',marginLeft:'5%',marginTop:'5px'}} className="select"  value={pos}
            onChange={(event) => setPos(event.target.value)}>
                <option value=''>SELECT</option>
      <option value="student">student</option>
      <option value="teacher">teacher</option>
    </select>
    
   
    <form onSubmit={sub}>
      <input
        className="form"
        type="username"
        placeholder="Class"
        value={clas}
        onChange={(event) => setClas(event.target.value)}
      />

    
    </form>
    <button
        className={isDesktop ? "b1" : "b"}
        onClick={(event)=>{handleaddusers(item,event)}}
      >
        ADD
      </button>
      <button
        className={isDesktop ? "b1" : "b"}
        style={{backgroundColor:'#f84b4b'}}
        onClick={()=>setAddusers(true)}
      >
       {<FaTimes/>} CANCEL
      </button></div>}
  </div>
)}
 {(!adddep || addusers) &&<div className={(show && "dropdown-animation")}>
     <button
      className={isDesktop ? "b1" : "b"}
      onClick={(event) => Anim(event)}
      style={{backgroundColor:'lightblue'}}
    >
     BACK
    </button></div>}</div>:<div></div>}
    </div>
))} 
</div>
   { notify&& <div>   
   {adddep ? (
  <div>
    {removedep && !showdep && <div>
    <button
      className={isDesktop ? "b1" : "b"}
      onClick={() => setAdddep(false)}
    >
      ADD DEPARTMENTS +
    </button>
  
    <button
      className={isDesktop ? "b3" : "b4"}
      onClick={() => {setRemovedep(false)}}
      
      
      
    >
     <FaMinusCircle/> REMOVE DEPARTMENT
    </button>
    </div>}
    {!removedep && <div>
      <h4>Note: Removing the department does not affect the users present in it.</h4>
      </div>}
  </div>
) : (
  <div>
   
    <form onSubmit={handleaddDept}>
      <input
        className="form"
        type="username"
        placeholder="Add Name"
        value={dept}
        onChange={(event) => setDept(event.target.value)}
      />

      <button
        className={isDesktop ? "b1" : "b"}
        onClick={() => handleaddDept}
      >
        ADD
      </button>
      <button
        className={isDesktop ? "b1" : "b"}
        style={{backgroundColor:'#f84b4b'}}
        onClick={() => setAdddep(true)}
      >
        {<FaTimes/>} CANCEL
      </button>
    </form>
  </div>
)}
</div>
}
{!removedep && <div>
  <button
      className={isDesktop ? "b1" : "b"}
      onClick={() => {setRemovedep(true)}}
      style={{backgroundColor:'lightblue',fontStyle:'bold'}}
    >
     BACK
    </button>
  </div>}
  
{notify? <div>
  <button
        className={isDesktop ? "b1" : "b"}
      
        onClick={() => setNotify(false)}
      >
        {<FaPen/>} NOTIFICATION
      </button>

</div>:<div className={(show && "dropdown-animation")}> 
<form >
      <label>
       <h3> Enter your text:</h3>
       <textarea className="form-control" style={{height: 'calc(2.5em + 4.75rem + 2px)',width:'90%',border:'6px solid rgb(251, 246, 246)'}} 
 value={input} onChange={handleChange} />
      </label>
    </form>
    <button className={isDesktop ? "b1" : "b"} onClick={inputnotify}
                                    >SUBMIT</button>
                                    <h2>OR</h2>
                                    <h2>Upload FILE</h2>
                                  
           <form onSubmit={submitFile}>
      <input type="file" onChange={handleFileUpload} />
      <button className={isDesktop ? "b1" : "b"} type="submit">SUBMIT</button>
    </form>
<button
      className={isDesktop ? "b1" : "b"}
      onClick={() => {setNotify(true)}}
      style={{backgroundColor:'lightblue',fontStyle:'bold'}}
    >
     BACK
    </button>
  </div>}
  <div>
    {!showxl ? <div >
      <button
      className={isDesktop ? "b1" : "b"}
      onClick={() => setShowxl(true)}
    >
      ADD MULTIPLE USERS +
    </button>
      
    </div>:<div className={(show && "dropdown-animation")}>
          <h1>Add users</h1>
          
              <div>
                
                  <h2>UPLOAD SPREADSHEET</h2>
            <input type="file" onChange={handleFileSelect} />
    
               <button className={isDesktop ? "b1" : "b"} onClick={handleattsheet}
                                 >SUBMIT</button> </div>
                                 <button
      className={isDesktop ? "b1" : "b"}
      onClick={() => {setShowxl(false)}}
      style={{backgroundColor:'lightblue',fontStyle:'bold'}}
    >
     BACK
    </button>
    </div>}
      
            </div>
  { notify && <div>
    <h2>SERVER SETTINGS</h2>
      {stops?   <div>
      <button  className={isDesktop ? "b1" : "b"}
        style={{backgroundColor:'#c80505'}} onClick={stop}>STOP SERVER</button>
      
    </div> :<div>
      <button  className={isDesktop ? "b1" : "b"}
        style={{backgroundColor:'#2ecf28'}} onClick={resume}>RESUME SERVER</button>
      </div>} </div>}
  
           </div>
:<div className='c' >YOU ARE LOGGED OUT</div>

 }

  </div>
}
export default AProfile
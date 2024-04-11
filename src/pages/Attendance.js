import React, { useEffect,useState} from "react"
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./App.css"
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode'
import {FaHome} from 'react-icons/fa'
var b = true;

function Attendance() {
    const [isClicked, setIsClicked] = useState(false);
    const [showatt, setShowatt] = useState(false);
    const [data, setData] = useState(null);
    const isDesktop = !/Mobi|Android/i.test(navigator.userAgent);
    const form = document.getElementById('form');
    const [showCalendar, setShowCalendar] = useState(false);
    const [showCalendar1, setShowCalendar1] = useState(false);
    const [date, setDate] = useState(new Date());
    const [date1, setDate1] = useState(new Date());
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
    const handleDateChange = (date) => {
        
        setDate(date);
        setShowCalendar(false); // Hide calendar after selecting date
      };
      const handleDateChange1 = (date) => {

        setDate1(date);
        setShowCalendar1(false); // Hide calendar after selecting date
      };
    const handleattshow = (event) => {
        event.preventDefault();
        // Handle name form submission here
        setShowatt(prevShowatt => !prevShowatt);
    };
    function gohome(){
        setIsClicked(true);
        window.location.href='./SProfile';
    }
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("https://cmp-server.onrender.com/api/student");
            const data = await response.json();
            setData(data);
        }
        fetchData();
    }, []);
  
    
    const subAtt = (data,date, date1) => {
        if (!data) return [];

        const [fromDay, fromMonth, fromYear] = date.toLocaleDateString().split("/");
        const [toDay, toMonth, toYear] = date1.toLocaleDateString().split("/");

        const from = new Date(fromYear, fromMonth - 1, fromDay);
        const to = new Date(toYear, toMonth - 1, toDay);
        let result = [];

        for (let sub in data.attendance) {
            let subject = data.attendance[sub].filter((item) => {
                const [day, month, year] = item.date.split("/");
                
                const date = new Date(year, month - 1, day);
           
                return date.getTime() >= from.getTime() && date.getTime() <= to.getTime();
            }).map(item => ({ subject: sub, date: item.date, value: item.value }));
            result.push(...subject);
        };

        return result;
       
    }
    function currentAtt(data) {
        let result = [];

        if (!data) return [];
        for (let sub in data.attendance) {
            var cnt = 0;
            var total = 0;
            for (let val of data.attendance[sub]) {
                if (val.value === 'Present') {
                    cnt = cnt + 1;
                }
                total += 1;
            };
            total = 100.0 * cnt / total; 
            result.push({ subject: sub, value: total });
            
        
        }
        return result;

    }
 
  

     return (
         <div className="c" >

             <div >

                 <h1>ATTENDANCE</h1>
                 {showatt && document.activeElement !== form ? <div>
                     {subAtt(data, date, date1).length > 0 ?
                         <ul class="no-bullets">
                              <h3>OVERALL ATTENDANCE</h3>
                             {currentAtt(data).map((item) => (
                                 <li className={isDesktop ? "attcont1" : "attcont"}> {item.subject}:  { item.value}%</li>

                             ))}
                             <h4>Subject    Date    Attendance</h4>
                             {subAtt(data, date, date1).map((item) => (
                                 <li className={isDesktop ? "attcont1" : "attcont"} key={item.date}>
                                      {item.subject}  {item.date}  {item.value} 
                                 </li>
                             ))}
                           
                            

                         </ul>

                         : <div>
                         None, Try another date
                         </div>}

                    
                     <button className={isDesktop ? "b1" : "b"}

                         onClick={handleattshow}
                     >GO BACK</button>
                 </div> : <div>
                    <h5>From:</h5>
                     <form id="form"   onSubmit={handleattshow}     onFocus={() => setShowCalendar(true)} 
>  {showCalendar && (
        <Calendar className='cal'
          onChange={handleDateChange}
          value={date}
        />
      )}
                     <div>
             </div>
                             <input
                                 className={isDesktop ? "form1" : "form"}
                                 type="text"
                                 placeholder="dd/mm/yyyy"
                                 value={date.toLocaleDateString() }
                                 readOnly
                             />
                         </form>
                         <h5>To:</h5>

                     <form id="form" onSubmit={handleattshow}  onFocus={() => setShowCalendar1(true)}  >
                     {showCalendar1 && (
        <Calendar className='cal'
          onChange={handleDateChange1}
          value={date1}
        />
      )}
                             <input
                                 className={isDesktop ? "form1" : "form"}
                                 type="text"
                                 placeholder="dd/mm/yyyy"
                                 value={date1.toLocaleDateString()}
                                 readOnly
                             />
                         </form>
                         <button className={isDesktop ? "b1" : "b"}

                             onClick={handleattshow}
                         >SUBMIT</button>
                 </div>}
                        
               
                
               
             
                 
   

             </div>
            
             <div className="d">
             <button className={isDesktop ? "B1" : "B"}
                 onClick={gohome}
                 > BACK</button>
             </div>
    </div>
  );
}
export default Attendance

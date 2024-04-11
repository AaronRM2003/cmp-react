import React, { useEffect,useState} from "react"
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./App.css"
import * as XLSX from 'xlsx';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import {FaHome} from 'react-icons/fa'
var b = true;

function UAttendance(){
    var [date,setDate]=useState(new Date());
    const [data, setData] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [flag, setFlag] = useState(false);
    const [cell,setCell] = useState(false);
    const [load,setLoad] = useState(false);
    const [class1,setClass1] = useState('');
    const [selectedValues, setSelectedValues] = useState({});
    const isDesktop = !/Mobi|Android/i.test(navigator.userAgent);
    const [value, onChange] = useState(new Date());
    const [jsonData, setJsonData] = useState(null);
    
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
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("https://cmp-server.onrender.com/api/total");
            const data = await response.json();
            setData(data);
        }
        fetchData();

        const fetchD = async () =>{
          const response = await fetch("https://cmp-server.onrender.com/api/student");
          const data = await response.json();
          setClass1(data.class);
        }
        fetchD();
    }, []);
    const students = (data) => {
      if (!data) return [];
      let result = data
          .filter(item => item.class === class1)
          .map(item => ({Rollno: item.classroll, student: item.name, roll: item.rollno, class: item.class }));
      return result;
  }
  
    function gohome(){
        window.location.href='./TProfile';
    }
    const handleDateChange = (date) => {
        
      setDate(date);
      setShowCalendar(false); // Hide calendar after selecting date
    };
    const handleSelectChange = (rollno, event) => {
        setSelectedValues((prevSelectedValues) => ({
          ...prevSelectedValues,
          [rollno]: event.target.value,
        }));
      };
      function isValidDate(dateString) {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
      }
    function handleatt(event){
        event.preventDefault();
        const hasEmptyString = Object.values(selectedValues).some(value => value === '');
        const [fromMonth, fromDay, fromYear] = date.toLocaleDateString().split("/");
       // const date1 = new Date(fromYear, fromMonth - 1, fromDay);
         date = date.toLocaleDateString();
        if(!hasEmptyString && Object.keys(selectedValues).length === data.length  && 0 < fromDay && fromDay <= 31 && 0 < fromMonth && fromMonth < 13 && 2020 < fromYear && fromYear < 2199){
          setLoad(true);
          console.log(selectedValues);
        axios.post("https://cmp-server.onrender.com/updateatt", {date,selectedValues }).then((response) => {
          setLoad(false);
        if(response.data.message==='success'){
          
         setFlag(true);
        }
            

        })
            .catch((error) => {
              setLoad(false);

                alert(error.response.data.message );
                console.log(error.response.data.message);
        });
        }
        else{
            alert('Please Select valid options or date');
        }
    }
    function handleattsheet(event){
      event.preventDefault();
    
     if(jsonData){
      axios.post("https://cmp-server.onrender.com/updateatt", {jsonData }).then((response) => {
        setLoad(true);

      if(response.data.message==='success'){
       setCell(true);
      }
          

      })
          .catch((error) => {
            setLoad(false);

              alert(error.response.data.message );
              console.log(error.response.data.message);
      });
      }
      else{
          alert('Please Select valid options or date');
      }
  }
    const handle = (event) => {
        event.preventDefault();
        // Han dle name form submission here
        setFlag(false);
    };
    const handlesheet = (event) => {
      event.preventDefault();
      // Han dle name form submission here
      setCell(false);
  };
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
    return (
        <div className="c" >
{ load &&
    <div className='loader1'></div>
}
            <div>
        <div >
            <h1>STUDENTS</h1>
          
              {!flag ?  <div>
             <ul class="no-bullets">
             {students(data).map((item) => (
                                 <li className={isDesktop ? "attcont1" : "attcont"} key={item.date}>
                                   {item.Rollno}.   {item.student}  {item.roll}  {item.class  }
                                   <select className="select"  value={selectedValues[item.Rollno] || ''}
            onChange={(event) => handleSelectChange(item.Rollno, event)}>
                <option value=''>SELECT</option>
      <option value="Present">Present</option>
      <option value="Absent">Absent</option>
    </select>
                                 </li>
                             ))}
             </ul>
           
            <h3>SELECT DATE OF ATTENDANCE</h3>
            <form  onSubmit={handleatt}      onFocus={() => setShowCalendar(true)}  >
            {showCalendar && (
        <Calendar className='cal'
          onChange={handleDateChange}
          value={date}
        />
      )}
                             <input
                                 className={isDesktop ? "form1" : "form"}
                                 type="text"
                                 placeholder="dd/mm/yyyy"
                                 value={date.toLocaleDateString() }
                                 readOnly
                             />
                         </form>
                         <button className={isDesktop ? "b1" : "b"} onClick={handleatt}
                                 >SUBMIT</button>
                                  </div> :<div><h3>SUBMITTED..</h3>
                                    <button className={isDesktop ? "b1" : "b"} onClick={handle}
                                    >GO BACK</button></div>
                                  }
                                               </div>

            <div>
              {!cell  ?
              <div>
                <h1>OR</h1>
                  <h2>UPLOAD SPREADSHEET</h2>
            <input type="file" onChange={handleFileSelect} />
               <button className={isDesktop ? "b1" : "b"} onClick={handleattsheet}
                                 >SUBMIT</button> </div>:<div> <h3>SUBMITTED..</h3> <button className={isDesktop ? "b1" : "b"} onClick={handlesheet}
                                 >GO BACK</button> </div>}
      
            </div>
          
             </div>
           
             <div className="d">
             <button className={isDesktop ? "B1" : "B"}
                 onClick={gohome}
                 > BACK</button>
             </div>
        </div>
    );
}
export default UAttendance;

import React,{useEffect,useState,useRef} from "react"
import "./App.css"
import * as XLSX from 'xlsx';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import {FaHome} from 'react-icons/fa'

var b=false;
function USessionals() {
    const [flag, setFlag] = useState(false);
    const [cell,setCell] = useState(false);
    const [series,setSeries] = useState('');
    const [selectedValues, setSelectedValues] = useState({});
    const isDesktop = !/Mobi|Android/i.test(navigator.userAgent);
    const [value, onChange] = useState(new Date());
    const [jsonData, setJsonData] = useState(null);
    const [class1,setClass1] = useState('');
    const [data,setData] = useState('');
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
    const handlesheet = (event) => {
        event.preventDefault();
        // Han dle name form submission here
        setCell(false);
    };
    const handle = (event) => {
        event.preventDefault();
        // Han dle name form submission here
        setFlag(false);
    };
    function handleatt(event){
        event.preventDefault();
        const hasEmptyString = Object.values(selectedValues).some(value => value === '');

        if(!hasEmptyString && Object.keys(selectedValues).length === data.length && series.length>0 ){
        axios.post("https://cmp-server.onrender.com/updatemark", {series,selectedValues }).then((response) => {
        if(response.data.message==='success'){
         setFlag(true);
        }
            

        })
            .catch((error) => {
                alert(error.response.data.message );
                console.log(error.response.data.message);
        });
        }
        else{
            alert('Please Select valid options or date');
        }
    }
    function handlemarksheet(event){
        event.preventDefault();
      
       if(jsonData){
        axios.post("https://cmp-server.onrender.com/updatemark", {jsonData }).then((response) => {
        if(response.data.message==='success'){
         setCell(true);
        }
            
  
        })
            .catch((error) => {
                alert(error.response.data.message );
                console.log(error.response.data.message);
        });
        }
        else{
            alert('Please Select valid options or date');
        }
    }
    const handlemark = (rollno, event) => {
        setSelectedValues((prevSelectedValues) => ({
        
          ...prevSelectedValues,
          [rollno]: event.target.value,
        
        }));
      };
      function handlesub(event)
       { 
    event.preventDefault();
    
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
   return  <div className="c" >
    <div>
<div >
<h1>SERIES MARKS</h1>

    <h2>STUDENTS</h2>
  
      {!flag ?  <div>
     <ul class="no-bullets">
     <select className="sel" 
            onChange={(event) => setSeries(event.target.value)} value={series}>
                <option value=''>SELECT</option>
      <option value="SERIES-1">SERIES-1</option>
      <option value="SERIES-2">SERIES-2</option>
    </select>
     {students(data).map((item) => (
                         <li className={isDesktop ? "attcont1" : "attcont"} key={item.date}>
                           {item.Rollno}.   {item.student}  {item.roll}  {item.class  }
                          <form onSubmit={handlesub}>
                            <input
                            placeholder="Marks Out of 50"
                            value={selectedValues[item.Rollno]}
                            onChange={(event)=>{handlemark(item.Rollno,event)}}>
                            </input>
                          </form>
                         </li>
                     ))}
     </ul>
   
  
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
          <h2>OR UPLOAD SPREADSHEET</h2>
    <input type="file" onChange={handleFileSelect} />
{jsonData? jsonData:""}
       <button className={isDesktop ? "b1" : "b"} onClick={handlemarksheet}
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

} 
export default USessionals
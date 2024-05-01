import React,{ useEffect,useState} from "react"
import "./App.css"
import {FaHome} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import axios from "axios";
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { eventWrapper } from "@testing-library/user-event/dist/utils";
import { MdPictureAsPdf } from "react-icons/md";
import { BsFileWord } from "react-icons/bs";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

var b = true;

function Assignments() {
    const [isClicked, setIsClicked] = useState(false);
    const [numPages, setNumPages] = useState(null);
    const [num, setNum] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [files, setFiles] = useState([]);
    const [files2, setFiles2] = useState([]);
    const [files1, setFiles1] = useState([]);
    const [show,setShow] = useState(false);
    const [data, setData] = useState(null);
    const [cls, setCls] = useState('');
    const [clsroll, setClsroll] = useState('');
    const [showupload,setShowupload] = useState(false);
    const [filen,setFilen] = useState("null");
    const [filename1,setFilename1] = useState("null");
    const [file,setFile] = useState(null);
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
  useEffect(()=>{
    setTimeout(() => {
      setShow(true);
  }, 5000);
    const fetchFile2 = async () => {
       
      const response = await fetch("https://cmp-server.onrender.com/api/alltotal");
      const data1 = await response.json();
    
      const numberOfFiles = 10;
      const files = [];
      if(data){

        for (let data of data1){

          if(data.pos === 'teacher' && data.class === cls){
            console.log(data.pos);

      for(let sub in data.assignment){
       var x = 0; // Fetch each file
      for (let fil of data.assignment[sub]) {
        try {
          console.log(fil.upload);
          const f = fil.studentfile;

         if(fil.classroll === clsroll ){
    
          const response = await axios(`https://cmp-server.onrender.com/getFile/${f}`, {
            method: 'GET',
            responseType: 'blob',
          // Force to receive data in a Blob Format
          });
          x=x+1;
          // Create a Blob from the PDF Stream
          const file = new Blob(
            [response.data], 
            {type: response.headers['content-type'] },
         
          );
      
          // Build a URL from the file
          const fileURL = URL.createObjectURL(file);
          var typ =response.headers['content-type'];
          if(response.headers['content-type']=== "application/pdf"){
             typ='pdf';

          }
          // Push the file URL and creation time to the array
          files.push({
            url: fileURL,
            creationTime: new Date(response.headers['x-creation-time']),
            type:typ,
            sub:sub,
            name:f,
            upload:fil.upload,
            roll:fil.classroll
          });
        }
        } catch (error) {
          console.log(error);
        }
      }
    }
  }}
    const l = x;
      // Sort the files array by creationTime
      files.sort((a, b) => b.creationTime - a.creationTime);
      // Extract the sorted URLs
      const urls = files.map(file => file.url);
     setNum(l);
      // Update the state
      setFiles2(files);
      console.log(files2);

    }
    }
    fetchFile2();
      }, [clsroll]);

    useEffect(() => {
      const fetchData = async () => {
        const response = await fetch("https://cmp-server.onrender.com/api/student1");
        const data = await response.json();
 
        setData(data);
        if(data.class){
        setCls(data.class);    
        setClsroll(data.classroll);

      }
    }
      fetchData();
      
      const fetchFile = async () => {
       
        const response = await fetch("https://cmp-server.onrender.com/api/student1");
        const data = await response.json();
      
        const numberOfFiles = 10;
        const files = [];
        console.log("p");
        if(data){
        for(let sub in data.assignment){
         var x = 0; // Fetch each file
        for (let fil of data.assignment[sub]) {
          try {
            console.log(fil);
            const f = fil.file;
           if(f != "null"){          
            
            const response = await axios(`https://cmp-server.onrender.com/getFile/${f}`, {
              method: 'GET',
              responseType: 'blob',
            // Force to receive data in a Blob Format
            });
          
            x=x+1;
            // Create a Blob from the PDF Stream
            const file = new Blob(
              [response.data], 
              {type: response.headers['content-type'] },
           
            );
            // Build a URL from the file
            const fileURL = URL.createObjectURL(file);
            var typ =response.headers['content-type'];
            if(response.headers['content-type']=== "application/pdf"){
               typ='pdf';


            }
            const parts = f.split('-');

// The original filename is all parts except the last one
           const originalFilename = parts.slice(0, -2).join('-');
           console.log(fileURL);

            // Push the file URL and creation time to the array
            files.push({
              url: fileURL,
              creationTime: new Date(response.headers['x-creation-time']),
              type:typ,
              sub:sub,
              name:originalFilename,
              
            });
          }
          } catch (error) {
            console.log(error);
          }
        }
      }
      
      const l = x;
        // Sort the files array by creationTime
        files.sort((a, b) => b.creationTime - a.creationTime);
      
        // Extract the sorted URLs
        const urls = files.map(file => file.url);
       setNum(l);
        // Update the state
        setFiles(files);
      }
      }
      // Call the function
      fetchFile();
      

      
    }, []);
    async function handleupload(event,item,subject,roll){

      event.preventDefault();
      console.log(num);

     const upload = item;
     const sub = subject;
     var classroll = '';
     if(data){
      classroll = data.classroll;
     }
     else{
       classroll = 'no';

     }
      if(file && filename1 != file.name){
        var flname = "null";
        if(file){
        if(filename1 != file.name){
        setFilename1(file.name);
        flname = file.name;
        
        }
        else{
         setFilename1("null");
       
        }
       }
       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
       var filename = flname;
       const filename2 = flname.split('.').slice(0, -1).join('.');
       const extension = flname.split('.').pop();
       if(flname != "null"){
       // Append the unique identifier to the filename.
       filename = `${filename2}-${uniqueSuffix}.${extension}`;
       }
       const fileWithSuffix = new File([file], filename, { type: file.type });

        const formData = new FormData()
        formData.append('file', fileWithSuffix);
        let headers = {
          'Content-Type': 'multipart/form-data',
         
        };
        
        axios.post("https://cmp-server.onrender.com/studentassig", { filename,upload,sub,classroll}).then((response) => {
  
          if(response.data.message==='success'){
          }
              
  
          })
              .catch((error) => {
                  alert(error.response.data.message );
                  console.log(error.response.data.message);
          });
        await axios.post('https://cmp-server.onrender.com/studentupload', formData, { headers })
        .then((response) => {
          alert("submitted file");
        })
        .catch((error) => {
          alert(error.response.data.message);
          console.log(error.response.data.message);
        });
      }
      else{
        alert("Attach file first");
      }


    }
    function convertDateFormat(str) {
      // Split the date, time, and individual date components
      let [date, time] = str.split(' ');
      let [month, day, year] = date.split('/');
    console.log(files2);
    console.log(files);
      // Reformat the date
      let newDateStr = `${year}-${month}-${day} ${time}`;
    
      return newDateStr;
    }
    function convertDateFormat1(str) {
      // Split the date, time, and individual date components
      let [date, time] = str.split(' ');
      let [month, day, year] = date.split('/');
    
      // Reformat the date
      let newDateStr = `${day}/${month}/${year} ${time}`;
    
      return newDateStr;
    }
    function convertDateFormat2(str) {
      // Split the date, time, and individual date components
     
      let [month, day, year] = str.split('/');
    
      // Reformat the date
      let newDateStr = `${day}/${month}/${year}`;
    
      return newDateStr;
    }
    
    function gohome(){
        setIsClicked(true);
        window.location.href='./SProfile';
    }
    const handleFileUpload = (event) => {
      setFile(event.target.files[0]);
    };
  function resubmit(event){
        event.preventDefault();
        if(window.confirm("Are you sure?")){
            setShow(true);
        }

  }
   
function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
    const subAtt = (data) => {
        if (!data) return [];

       
       let result = [];
     
        for (let sub in data.assignment) {
            let subject = data.assignment[sub].map(item => ({ subject: sub, date: item.date, value: item.value,upload:item.upload,file: item.file,submit:item.submit }));
            result.push(...subject);
        };

        return result;
       
    
}
    return <div className="c container-fluid">
                <div className={isClicked? 'Box':""}></div>
 

{subAtt(data).length > 0 ?<div >

    <h1 >Assignments</h1>
                  
                         <ul >
                             {subAtt(data).sort((a, b) => {
  let uploadA = new Date(convertDateFormat(String(a.upload)));
  let uploadB = new Date(convertDateFormat(String(b.upload)));
  
  return uploadB - uploadA;
}).map((item) => (
  
  <li className={isDesktop ? "attcont3" : "attcont2"} key={item.date}>
    <h4>{item.subject}</h4>

    <div className={isDesktop ? "attcont1" : "attcont"}>
      <h5>Assignment:</h5> {item.value}


    </div>
  
    {files.map((file) => {
    
    let isUploadPresent = files2.some(file2 => file2.upload === item.upload);
    const parts = item.file.split('-');

    // The original flname is all parts except the last one
     const originalFilename = parts.slice(0, -2).join('-');
  if (originalFilename == file.name) {
    

    return (
      <div>
      
        <h4>Attached file</h4>
      <a
        className="pdf-button"
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
      >
      {file.type.includes('word') && <BsFileWord  style={{color: 'rgb(38, 108, 221)'}} />}

  {file.type === 'pdf' && <MdPictureAsPdf style={{color: 'red'}} />
}  {file.name}
      </a>
      </div>
    );
  }
  
  return null;
})}
  { item.submit==="Yes" ?
  <>
    {files2.some(file2 => file2.upload === item.upload)?<>
        <div>
         <h2>File submitted</h2>
         <a
        href={ files2.find(file2 => file2.upload === item.upload).url}
        target="_blank"
        rel="noopener noreferrer"
      >      
         <button className={isDesktop ? "b1" : "b"} 
                                    >View submitted file</button>
                                    </a>
                               

        </div>
        <h2>Resubmit file</h2>
        </>:<> <h2>Upload file</h2></>}
 
  <form >
        <input type="file" onChange={handleFileUpload} required/>
   </form>
   <button className={isDesktop ? "b1" : "b"} onClick={(event) =>handleupload(event,item.upload,item.subject)}
                                    >SUBMIT</button>
  </>:<></>}
    <h5>Due date: {convertDateFormat2(String(item.date))}</h5>
    <h5>Uploaded date: {
    convertDateFormat1(String(item.upload))}</h5>

  </li>
))}
                                                </ul> 
                                             
      </div >               :<div >
        {!show?<div className="loader"></div>:<div>                                                      
        <h1>No Assignments so far</h1>
</div>}
                                                        </div>}
                                                      
                                                        <div className="d">
             <button className={isDesktop ? "B1" : "B"}
                 onClick={gohome}
                             > BACK</button>
             </div>

    </div>
}
export default Assignments
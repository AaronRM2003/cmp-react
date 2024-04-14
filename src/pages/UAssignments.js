import React,{ useEffect,useState} from "react"
import "./App.css"
import axios from 'axios'
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { pdfjs } from 'react-pdf';
import { MdPictureAsPdf } from "react-icons/md";
import { TbFileTypeDocx } from "react-icons/tb";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


var b = true;

function UAssignments() {
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
    const [flag,setFlag] = useState(false);
    const [assig,setAssig] = useState('');
    const [selectedValue,setSelectedvalue] = useState('');
    var [len,setLen] = useState(0);
    const [filename1,setFilename1] = useState('null');
    var [date,setDate] = useState(new Date());
    var [date1,setDate1] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const [load, setLoad] = useState(false);
    const [file,setFile] = useState(null);
    const [files,setFiles] = useState(null);
    const [all,setAll] =useState(null);
    const [sub,setSub] = useState('');
    const [data,setData] = useState('');
    const isDesktop = !/Mobi|Android/i.test(navigator.userAgent);
    const handleDateChange = (date) => {
         
      setDate(date);
      setShowCalendar(false); // Hide calendar after selecting date
    }
    function gohome(){
      window.location.href='./TProfile';
  }
  useEffect(() => {
    const fetchData = async () => {
        const response = await fetch("https://cmp-server.onrender.com/api/student");
        const data = await response.json();
       setData(data);
       setSub(data.subject);
    }
    fetchData();
    const fetchData1 = async () => {
      const response = await fetch("https://cmp-server.onrender.com/api/alltotal");
      const data = await response.json();
      setAll(data);
  }
  fetchData1();
    const fetchFile = async () => {
       
      const response = await fetch("https://cmp-server.onrender.com/api/student");
      const data = await response.json();
    
      const numberOfFiles = 10;
      const files1 = [];
      console.log("p");
      if(data){
      for(let sub in data.assignment){
       var x = 0; // Fetch each file
      for (let fil of data.assignment[sub]) {
        try {
          const f = fil.studentfile;
          console.log(f);

        
    
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
          // Push the file URL and creation time to the array
          files1.push({
            url: fileURL,
            creationTime: new Date(response.headers['x-creation-time']),
            type:typ,
            sub:sub,
            name:originalFilename
          });
        } catch (error) {
          console.log(error);
        }
      }
    }

      // Sort the files array by creationTime
      files1.sort((a, b) => b.creationTime - a.creationTime);
    
      // Extract the sorted URLs
    
      // Update the state

    }    setFiles(files1);
    console.log(files1);


    }
    // Call the function
    fetchFile();
  },[]);

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

    const handleChange = (event) => {
        setAssig(event.target.value);
      };
      function isValidDate(dateString) {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
      }
      const pro = (all) => {
        try {
            if (!data || !data.assignment || !data.assignment[sub] || !all) return [];
            let uploads =[];
             for(let user of all){
              if(user.assignment && user.class===data.class){
               for (let obj of user.assignment[sub]){
                uploads.push(obj.upload);

               }
              }
             }
             uploads= [...new Set(uploads)];
             console.log(uploads);
            let assignmentClassrolls = data.assignment[sub].map(item => item.classroll);
           
            let result = all.filter(item => assignmentClassrolls.includes(item.classroll))
                .map(item => ({pos: item.pos, name: item.name, class: item.class, phone: item.phone, roll: item.classroll,studentfile:item.studentfile,upload:uploads}));
                let uniqueResult = result.reduce((acc, current) => {
                  const x = acc.find(item => item.roll === current.roll);
                  if (!x) {
                    return acc.concat([current]);
                  } else {
                    return acc;
                  }
                }, []);
                console.log(uniqueResult);

            return uniqueResult;
        } finally {

        }
    }
    const pro1 = (all) => {
      try {
          if (!data || !data.assignment || !data.assignment[sub]|| !all) return [];
             
          let assignmentClassrolls = data.assignment[sub].map(item => item.classroll);
  
          let result = data.assignment[sub].filter(item => assignmentClassrolls.includes(item.classroll))
              .map(item => ({roll: item.classroll,studentfile:item.studentfile,upload:item.upload}));
              console.log(result);

          return result;

      } finally {

      }
  }
    const subAtt = (all) => {
      if (!all) return [];

  
    let result = all.filter(item => item.class === data.class)
    .map(item => ({subject: sub, date: item.date, value: item.value,upload:item.upload,file: item.file}));
      return result;
     
  
}
    function convertDateFormat(str) {
      // Split the date, time, and individual date components
      let [date, time] = str.split(' ');
      let [month, day, year] = date.split('/');
    
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
    const groupedByDate = pro(all, data.class).reduce((acc, item) => {
      item.upload.forEach(uploadDate => {
          if (!acc[uploadDate]) {
              acc[uploadDate] = [];
          }
          acc[uploadDate].push(item);
      });
      return acc;
  }, {});
  
  const sortedDates = Object.keys(groupedByDate).sort();
  
    async function handleassig(event){
       event.preventDefault();
       var filename = "null";
       if(file){
       if(filename1 != file.name){
       setFilename1(file.name);
       filename = file.name;
       
       }
       else{
        setFilename1("null");
      
       }
      }

       const [fromDay, fromMonth, fromYear] = date.toLocaleDateString('en-IN').split("/");
       date = date.toLocaleDateString('en-IN');
       let date3 = new Date().toLocaleTimeString();
       let  date2 = new Date().toLocaleDateString('en-IN') + " " + date3;
       date1 = date2;
       if(window.confirm("Are you sure?")){
      if(assig && 0 < fromDay && fromDay <= 31 && 0 < fromMonth && fromMonth < 13 && 2020 < fromYear && fromYear < 2199){
        setLoad(true);

       
        setSub(data.subject);
        setLoad(true);
        var cnt = 0;
        let res = [];
        for (let sub in data.assignment){
       cnt =data.assignment[sub].length;
       
       
      }
      
        const l = len;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        var filenameWithSuffix = filename;
        const filename1 = filename.split('.').slice(0, -1).join('.');
        const extension = filename.split('.').pop();
        if(filename != "null"){
        // Append the unique identifier to the filename.
        filenameWithSuffix = `${filename1}-${uniqueSuffix}.${extension}`;
      
        }
        console.log(filenameWithSuffix,filename);
        // Create a new File object with the modified filename.
       
        // Append the modified file to the formData object.
        axios.post("https://cmp-server.onrender.com/assig", { assig,date,date1,filenameWithSuffix,selectedValue }).then((response) => {
          setLoad(false);
  
          if(response.data.message==='success'){
           setFlag(true);
          }
              
  
          })
              .catch((error) => {
                  alert(error.response.data.message );
                  console.log(error.response.data.message);
          });
        
       
        console.log(sub+cnt,data.subject,len,filenameWithSuffix);
        let headers = {
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Headers' : sub,
          'date111':fromDay +fromMonth+ fromYear,
          'len':l,
        };
        if(file){
          const fileWithSuffix = new File([file], filenameWithSuffix, { type: file.type });
          const formData = new FormData()
          formData.append('file', fileWithSuffix);
        await axios.post('https://cmp-server.onrender.com/upload', formData, { headers })
          .then((response) => {
            setLoad(false);
            alert("submitted file");
            setLen(++len);
          })
          .catch((error) => {
            alert(error.response.data.message);
            console.log(error.response.data.message);
          });
        }
        }
        else{
            alert('Please enter valid text or date');
    }
}
}
   
   
   return <div className="c"> 
   { load &&
    <div className='loader1'></div>
}
   {!flag && data.class? <div >
    <ul style={{paddingLeft:'10%'}}>
      {sortedDates.length>0 &&   <h2>Student Submissions</h2>}
        {
 sortedDates.map((date, index) => (
    <div className={isDesktop ? "attcont1" : "attcont"}>
        <h2>Assignment {index + 1}</h2>
        {groupedByDate[date].map((item) => (
            <li >
                Name: {item.name} Class: {item.class} Roll:{item.roll} {item.studentfile}
                {pro1(data).filter(i => i.upload === date ).map(i => (
                    <>
                        {files && files.map((file) => {
                           const parts = i.studentfile.split('-');

                           // The original flname is all parts except the last one
                            const originalFilename = parts.slice(0, -2).join('-');
                            if (file.name === originalFilename && i.roll===item.roll) {
                                return (
                                    <div>
                                        <a
                                            className="pdf-button"
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                     {file.type.includes('word') && <TbFileTypeDocx style={{color: 'blue'}} />}
   {file.type === 'pdf' && <MdPictureAsPdf style={{color: 'red'}} />
}     {file.name}
                                        </a>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </>
                ))}
            </li>
        ))}
    </div>
))


        
        
}

        </ul>

       
     <h2>Add Assignment:</h2>
     <form >
      <label>
       <h3> Enter your text:</h3>
       <textarea className="form-control" style={{height: 'calc(2.5em + 4.75rem + 2px)',width:'90%',border:'6px solid rgb(251, 246, 246)'}} 
 value={assig} onChange={handleChange} />
      </label>
    </form>
    <form onSubmit={handleassig} onFocus={() => setShowCalendar(true)}>
    <h2>        Set Date of Submission:
</h2>
    {showCalendar && (
        <Calendar className='cal'
          onChange={handleDateChange}
          value={date}
        />
      )}
        
                <input
                            className="form"
                type="text"
                placeholder="Date"
                    value={date.toLocaleDateString()}
                    readOnly
                    
                onChange={(event) => setDate(event.target.value)}
            />
           </form>
           <h2>Do you want to receive submissions from students</h2>
           <select className="select"  value={selectedValue}
            onChange={(event)=> setSelectedvalue(event.target.value)}>
                <option value=''>SELECT</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>

    </select>
           <h2>Upload FILE</h2>
                                  
                                  <form >
                             <input type="file" onChange={handleFileUpload} />
                           </form>
    <button className={isDesktop ? "b1" : "b"} onClick={handleassig}
                                    >SUBMIT</button>
                            
    </div>: <div >
        <h2>Submitted..</h2>
        <button className={isDesktop ? "b1" : "b"} onClick={() =>setFlag(false)}
                                    >GO BACK</button>
        
        </div>}

        <div className="d">
             <button className={isDesktop ? "B1" : "B"}
                 onClick={gohome}
                 > BACK</button>
             </div>
    </div>  
}
export default UAssignments
import React,{useEffect,useState} from "react"
import  "./App.css"
import axios from "axios";
import { MdPictureAsPdf } from "react-icons/md";


function Notifications() {
    const [files,setFiles] = useState([]);
    const [data,setData] = useState('');
    const isDesktop = !/Mobi|Android/i.test(navigator.userAgent);

  function gohome(){
    window.location.href='/';
}
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("https://cmp-server.onrender.com/notifications");
            const data = await response.json();
            setData(data);
        }
        fetchData();
      
        const fetchFile = async () => {
          const numberOfFiles = 10;
          const files = [];
        
          // Fetch each file
          for (let i = 0; i < numberOfFiles; i++) {
            try {
              const response = await axios(`https://cmp-server.onrender.com/getNotify/${i}`, {
                method: 'GET',
                responseType: 'blob' // Force to receive data in a Blob Format
              });
              // Create a Blob from the PDF Stream
              const file = new Blob(
                [response.data],
              
                {type: response.headers['content-type'] }
              );
        
              // Build a URL from the file
              const fileURL = URL.createObjectURL(file);
        
              // Push the file URL and creation time to the array
              files.push({
                url: fileURL,
                creationTime: new Date(response.headers['x-creation-time']),
                type: response.headers['content-type'] 
              });
            } catch (error) {
              console.log(error);
            }
          }
        
          // Sort the files array by creationTime
          files.sort((a, b) => b.creationTime - a.creationTime);
        
          // Extract the sorted URLs
          const urls = files.map(file => file.url);
        
          // Update the state
          setFiles(files);
          console.log(files);

        }
        
        // Call the function
        fetchFile();
        
      }, []);
      function convertDateFormat(str) {
        // Split the date, time, and individual date components
        let [date, time] = str.split(' ');
        let [day, month, year] = date.split('/');
      
        // Reformat the date
        let newDateStr = `${year}-${month}-${day} ${time}`;
      
        return newDateStr;
      }
      
      const Nf = (data) => {
        if (!data) return [];

       
       let result = [];
     
      
            let nf = data.notifications.map(item => ({  date: item.date, value: item.value }));
            result.push(...nf);
        

        return result;
       
    
}


    return <div className="c">    
    <h2>Notifications</h2>  
         <ul >{ Nf(data).sort((a, b) => {
  let dateA = new Date(convertDateFormat(String(a.date)));
  let dateB = new Date(convertDateFormat(String(b.date)));
  return dateB - dateA;
}).map((item) => (
  <li className={isDesktop ? "attcont3" : "attcont2"} key={item.date}>
    <h3>{item.date}</h3>
    <div className={isDesktop ? "attcont1" : "attcont"}> {item.value}</div>  
  </li>
))}
                                                </ul> 
            <div className={isDesktop ? "attcont3" : "attcont2"}>
    <h2>Attached Files</h2>
    {files.length>0? <div >
  {files.map((file, index) => (
    <div>
  <a className="pdf-button" key={index} href={file.url} target="_blank" rel="noopener noreferrer">
  {file.type === 'application/pdf' && <MdPictureAsPdf style={{color: 'red'}} />
} Open {file.type} {new Date(file.creationTime).toLocaleDateString() + ' '+new Date(file.creationTime).toLocaleTimeString()}
  </a>
  
</div>


))}
</div>:<div className="loader"></div>}


</div>
<div><button
      className={isDesktop ? "b1" : "b"}
      onClick={gohome}
      style={{backgroundColor:'lightblue'}}
    >
     BACK
    </button>
    </div>

    </div>
}
export default Notifications;
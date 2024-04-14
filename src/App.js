
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link} from "react-router-dom";
import React,{useEffect} from 'react';
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Login from "./pages/Form";
import About from "./pages/About";

import "./pages/App.css"
import SProfile from "./pages/SProfile";
import CSProfile from "./pages/CSProfile";
import CTProfile from "./pages/CTProfile";
import AProfile from "./pages/AProfile";
import Attendance from "./pages/Attendance";
import Assignments from "./pages/Assignments";
import Sessionals from "./pages/Sessionals";
import TProfile from "./pages/TProfile";
import UAttendance from "./pages/UAttendance";
import UAssignments from "./pages/UAssignments";
import USessionals from "./pages/USessionals";
import Notifications from "./pages/Notifications";
import { useState } from "react";

export default function App() {
    const [isVisible, setIsVisible] = useState(false);
    const [opacity, setOpacity] = useState(0);
  
    useEffect(() => {
      if (isVisible) {
        // Wait for next render before starting fade-in
        setTimeout(() => setOpacity(1), 0);
      } else {
        setOpacity(0);
      }
    }, [isVisible]);
    var b= false;

    useEffect(() => {
        setShow(true);
      }, []);
     
     
  
    const [show, setShow] = useState(false);
    function log() {
        window.location.href = "/pages/Form";
    }
    return (
        <div  className={`fade ${show ? "show" : ""} container-fluid`}   >
            <div >
        <BrowserRouter >
     
            <div className="h1" >


                <p>
                    RiTec <div className="h"><div onClick={()=>setShow(true)}> <Link className="link" to="/pages/Form"  >Login</Link>      <Link className="link" to="/pages/Contact" >Contact</Link>   <Link className="link" to="/pages/About">About</Link>
                    </div> </div></p>
     


            </div>




            <Routes  >
                <Route path="/" element={<Home />} />
                <Route path="/pages/Form" element={<Login />} />


                <Route path="/pages/Contact" element={<Contact />} />
                <Route path="/pages/About" element={<About />} />
                <Route path="/pages/SProfile" element={<SProfile />} />
                <Route path="/pages/Attendance" element={<Attendance />} />
                <Route path="/pages/Assignments" element={<Assignments />} />
                <Route path="/pages/Sessionals" element={<Sessionals />} />
                <Route path="/pages/TProfile" element={<TProfile />} />
                <Route path="/pages/UAttendance" element={<UAttendance />} />
                <Route path="/pages/UAssignments" element={<UAssignments />} />
                <Route path="/pages/USessionals" element={<USessionals />} />
                <Route path="/pages/AProfile" element={<AProfile />} />
                <Route path="/pages/CSProfile" element={<CSProfile />} />
                <Route path="/pages/CTProfile" element={<CTProfile />} />
                <Route path="/pages/Notifications" element={<Notifications />} />



            </Routes>


            <div className="c1" style={{fontStyle:'italic',color:'grey',fontFamily:'fomt',fontSize:'120%'}}>
COPYRIGHT ALRON TECH
            </div>

        </BrowserRouter>
        </div>
        </div>
    );

}


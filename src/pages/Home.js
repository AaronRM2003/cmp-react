/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState, useRef, useContext, createContext } from 'react';

import "./App.css"
import { FaPen } from 'react-icons/fa';
const SlideshowContext = createContext();

export function Slideshow({ children, className, style }) {
    const [context, setContext] = useState({
        items: [],
        edge: false
    });
    const timer = useRef(null);

    useEffect(() => {
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            // Move deactivated slide out when edge is false
            // Move activated slide in when edge is true
            if (context.items.length > 1 && context.edge) {
                const head = context.items.shift();
                context.items.push(head);
            }
            context.edge = !context.edge;
            setContext({ ...context });
        }, 2500);
        return () => clearTimeout(timer.current);
    });

    console.log(context.items);

    return (
        <SlideshowContext.Provider value={[context, setContext]}>
            <div
                style={{
                    
                    height: "600px",
                    width: "600px",
                    position: "relative",
                    overflow: "hidden"
                    
                }}
            >
                {children}
            </div>
        </SlideshowContext.Provider>
    );
}
export function SlideshowItem({ children }) {
    const name = useRef(`${performance.now()}_${Math.random()}`); // Generate a name for this slide.
    const [context] = useContext(SlideshowContext);
    const [stage, setStage] = useState("ready");

    useEffect(() => {
        // register self with the name.
        context.items.push(name.current);
        return () => {
            // Remove the name when slide is removed.
            const index = context.items.indexOf(name.current);
            context.items.splice(index, 1);
        };
    }, []);

    useEffect(() => {
        const activeName = context.items[0];
        if (activeName === name.current) {
            setStage("on");
        }
        if (activeName !== name.current && stage === "on") {
            setStage("off");
        }
        if (activeName !== name.current && stage === "off") {
            setStage("ready");
        }
    }, [context]);

    let left = 0;
    let zIndex = 0;
    switch (stage) {
        case "ready":
            left = "100%";
            break;
        case "on":
            left = "0";
            zIndex = 1;
            break;
        case "off":
            zIndex = 0;
            break;
        default:
    }

    return (
        <div
            style={{
                transition: "0.5s",
                position: "absolute",
                top: 0,
                left: left,
                zIndex: zIndex
            }}
        >
            {children}
        </div>

    );
}


//const Home = ()=>{
	//return   <header>

      //  <p>HOME</p>
        //</header>
            
	
//};
function Home() {
    const isDesktop = !/Mobi|Android/i.test(navigator.userAgent);
    function notify(){
        window.location.href='/pages/Notifications';
    }
    
    return <div >
    <div className="slide">
        <Slideshow >
                <SlideshowItem className="slideshow">
                    <img src="https://picsum.photos/600/600" alt="Random Image" />
            </SlideshowItem>
            <SlideshowItem>
                <img src="https://picsum.photos/600/600?grayscale" alt="Random Grayscale Image" />
            </SlideshowItem>
        </Slideshow>
        </div>


        <div className="c">
        <div>
        <button
        className={isDesktop ? "b1" : "b"}
      
        onClick={notify}
      >
        {<FaPen/>} NOTIFICATIONS
      </button>
      </div >
      <h1 style={{color:'lightgreen',textAlign:'center'}}>Welcome to Campus Connect!</h1>
               <h5 style={{fontStyle:'italic'}}>Where Management Meets Innovation. </h5>
           <div style={{display:'flex',flexDirection:'column'}}>
             <div className='attcont3' style={{marginTop:'10%'}}>
             
               <h2 style={{color:'yellow'}}>Simplify Your Academic World Dive into a seamless management experience.</h2> <h4>Campus Connect is your digital companion, streamlining every aspect of campus life.</h4>           </div>

<div className='attcont3' style={{marginTop:'10%'}}>
<h2 style={{color:'yellow'}}>For Students:</h2> <h4>Navigate your academic voyage with ease. Access schedules, track grades, and utilize campus resources—all in one place.
</h4></div>
<div className='attcont3' style={{marginTop:'10%'}}>
<h2 style={{color:'yellow'}}>For Faculty:</h2><h4> Empower your teaching with our intuitive tools. Manage courses, engage with students, and harness the power of efficient grading.
</h4></div>
<div className='attcont3' style={{marginTop:'10%'}}>
<h2 style={{color:'yellow'}}>For Administrators:</h2><h4> Lead with insight. Oversee operations, analyze data, and elevate your institution with our comprehensive management solutions.
</h4></div>
</div>
      </div>
        <div >
               
            

              
        </div>

    </div>
}
export default Home;

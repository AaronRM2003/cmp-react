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
      </div>
             <h1> WELCOME TO RIT </h1>
       
      </div>
        <div >
               
            

              
        </div>

    </div>
}
export default Home;

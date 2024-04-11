import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { FaHome } from 'react-icons/fa';

function Sessionals() {
    const [data, setData] = useState(null);
    const navigate = useNavigate();
    const isDesktop = !/Mobi|Android/i.test(navigator.userAgent);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("http://localhost:3001/api/student");
            const data = await response.json();
            setData(data);
        }
        fetchData();

        if (localStorage.getItem("token1")) {
            const intervalId = setInterval(() => {
                const currentDate = Date.now();
                const data = localStorage.getItem("token1");
                const datenow = localStorage.getItem("datenow");
                const decodedToken = jwtDecode(data);
                console.log(decodedToken.exp);
                if (decodedToken.exp * 1000 < currentDate - datenow) {
                    alert('Session Timeout\nRedirecting to login page');
                    navigate('/pages/Form', { replace: true });
                }
            }, 1000); // Check every second

            // Clear interval on unmount
            return () => clearInterval(intervalId);
        } else {
            navigate('/pages/Form', { replace: true });
        }
    }, [navigate]);

    const subSessional = (data) => {
        if (!data) return [];

        let result = [];

        for (let sub in data.sessionals) {
            let subject = data.sessionals[sub].map(item => ({ series: item.series, subject: sub, value: item.value }));
            result.push(...subject);
        };

        return result;
    }

    function gohome() {
        navigate('/pages/SProfile', { replace: true });
    }

    return (
        <div className="c">
            <div>
                <h1>Sessionals</h1>
                {subSessional(data).length > 0 ?
                    <ul class="no-bullets">
                        <h4>Series    Subject    Marks</h4>
                        {subSessional(data).map((item) => (
                            <li className={isDesktop ? "attcont1" : "attcont"} key={item.series}>
                                {item.series}  {item.subject}  {item.value}
                            </li>
                        ))}
                    </ul>
                    :
                    <div>
                        <h2>No Sessionals Found</h2>
                    </div>
                }
            </div>
            <div className="d">
                <button className={isDesktop ? "B1" : "B"}
                    onClick={gohome}
                > BACK</button>
            </div>
        </div>
    );
}

export default Sessionals;

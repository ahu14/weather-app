import {useState, useEffect} from "react";
import Weather from "./Weather";


let Home = () => {
    let [isOn, setIsOn] = useState(navigator.onLine);
    let [state, setState] = useState('current-condition');

    useEffect(() => {
        let checkSignal = () => {
            setIsOn(isOn = navigator.onLine);
            requestAnimationFrame(checkSignal);
        }

        requestAnimationFrame(checkSignal);
    }, []);

    let clicked = (event) => {
        if (event.target.id !== state){
            setState(event.target.id);
        }
    }


    if (!isOn){
        return (
            <div className="flex w-full h-screen justify-center items-center">
                <div className="w-24 h-24 border-8 rounded-full border-r-amber-200 
                border-t-amber-300 border-l-amber-400 border-b-amber-500 animate-spin"></div>
            </div>
        )
    }

    else{
        return (
            <div className="flex w-full h-screen flex-col">
                <ul className="w-full h-fit py-2 flex flex-col 
                bg-red-500 text-xl sm:flex-row justify-around">
                    <li id="current-condition" onClick={clicked}
                    className="py-0.5 cursor-pointer">Current Conditions</li>
                    <li id="forecast-hourly" onClick={clicked}
                    className="py-0.5 cursor-pointer">Forecast Hourly</li>
                    <li id="forecast-daily" onClick={clicked}
                    className="py-0.5 cursor-pointer">Forecast Daily</li>
                </ul>

                <div className="flex w-full h-screen justify-center items-center flex-col text-center">
                    <Weather isOn={isOn} state={state} />
                </div>
            </div>
        )
    }
}


export default Home;
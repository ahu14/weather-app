import {useState, useEffect} from "react";
import {link} from "./FunctionData.js";


let takeData = (link, func) => {
    fetch(link)
    .then(res => res.json())
    .then(d => func(d))
    .catch(err => console.log(err.message));
}


let Weather = ({isOn, state}) => {
    let [placeData, setPlaceData] = useState([{
        temp: '',
        feels_like: '',
        temp_max: '',
        temp_min: '',
        weather: '',
        name: '',
        country: ''
    }]);
    let [forecast, setForecast] = useState([]);
    let [posData, setPosData] = useState({
        long: '',
        lat: ''
    })

    useEffect(() => {
        let showPosition = (pos) => {
            let longitude = pos.coords.longitude;
            let latitude = pos.coords.latitude;

            setPosData(prev => ({
                long: longitude,
                lat: latitude
            }));
        }

        navigator.geolocation.getCurrentPosition(showPosition);
    }, [isOn]);


    useEffect(() => {        
        if (posData.long !== '' && posData.lat !== ''){
            for (let i of link){
                if (state === 'current-condition'){
                    takeData(i.setlink(posData.lat, posData.long), (d) => i.func(d, setPlaceData));
                    break;
                }
    
                else{
                    if (state === i.name){
                        takeData(i.setlink(posData.lat, posData.long), 
                        (d) => i.func(d, setPlaceData, forecast, setForecast));
                    }
                }
            }
        }
    }, [state, posData]);


    if (state === "current-condition"){
        return (
            <div className="w-fit h-34 mt-3 sm:mx-2 px-5 py-7">
                <div className="font-bold text-xl text-center">
                    <p>{placeData.name}, {placeData.country}</p>
                </div>
    
                <div className="text-xl">
                    <p>{placeData.weather}</p>
                    <p>{placeData.temp}&#176;C but feels like {placeData.feels_like}&#176;C</p>
                    <p>{placeData.temp_min}&#176;C - {placeData.temp_max}&#176;C</p>
                </div>
            </div>
        )
    }

    else{
        return (
            <div className="flex w-full h-screen justify-start items-center flex-col text-center">
                <div className="mt-5 font-bold text-xl text-center">
                    <p>{placeData.name}, {placeData.country}</p>
                </div>

                <div className="w-fit h-fit text-[4vw] sm:text-xl">
                    <div className="grid grid-rows-4 mt-0 mb-3">
                        {forecast} 
                    </div>
                </div>
            </div>
        )
    }
}

export default Weather;
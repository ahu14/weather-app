import {useState, useEffect} from "react";
import {link} from "./FunctionData.js";


let takeData = (link, func) => {
    fetch(link)
    .then(res => res.json())
    .then(d => func(d))
    .catch(err => console.log(err.message));
}


let Weather = ({isOn, state}) => {
    let [key, setKey] = useState();
    let [placeData, setPlaceData] = useState({
        time: '',
        date: '',
        name: '',
        weather: '',
        temperature: ''
    });
    let [weatherData, setWeatherData] = useState([]);


    useEffect(() => {
        let showPosition = (pos) => {
            let longitude = pos.coords.longitude;
            let latitude = pos.coords.latitude;
            
            takeData(`https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${process.env.REACT_APP_API_KEY}&q=${latitude}%2C${longitude}`, (d) => {
                setKey(d.Key);
                setPlaceData(prev => {
                    prev.name = `${d.LocalizedName}, ${d.ParentCity.LocalizedName}, ${d.AdministrativeArea.LocalizedName}, ${d.Country.LocalizedName}`;

                    return ({
                        time: prev.time,
                        date: prev.date,
                        name: prev.name,
                        weather: prev.weather,
                        temperature: prev.temperature
                    })
                })
            })
        }

        navigator.geolocation.getCurrentPosition(showPosition);
    }, [isOn]);


    useEffect(() => {
        if (key !== undefined){
            for (let i of link){
                if (i.name === state && state !== "current-condition"){
                    takeData(i.setlink(key), (d) => i.func(d, setWeatherData)); 
                }

                else if (i.name === state && state === "current-condition"){
                    takeData(i.setlink(key), (d) => i.func(d, setPlaceData)); 
                }
            }
        }
    }, [state, key]);


    if (state === "current-condition"){
        return (
            <div className="w-fit h-34 mt-3 sm:mx-2 px-5 py-7">
                <div className="font-bold text-xl text-center my-3">
                    <h2>{placeData.name}</h2>
                    <h2>{placeData.date} {placeData.time}</h2>
                </div>
    
                <div className="text-xl">
                    <p>{placeData.weather}</p>
                    <p>{placeData.temperature}&#176;C</p>
                </div>
            </div>
        )
    }

    else if (state === "forecast-hourly" && weatherData !== undefined){
        return (
            <div className="flex w-full h-screen justify-start items-center flex-col text-center">
                <div className="font-bold text-xl text-center my-3 mb-5">
                    <h2>{placeData.name}</h2>
                </div>

                <div className="w-fit h-fit text-[4vw] sm:text-xl">
                    <div className="grid grid-cols-4 mt-0 mb-3 font-bold">
                        <p>{placeData.date}</p>
                        <p>{placeData.time}</p>
                        <p>{placeData.weather}</p>
                        <p>{placeData.temperature}&#176;C</p>
                    </div>

                    {weatherData}
                </div>
            </div>
        )
    }

    else{
        if (weatherData !== undefined){
            return (
                <div className="flex w-full h-screen justify-start items-center flex-col text-center">
                    <div className="font-bold text-xl text-center mt-3 mb-0">
                        <h2>{placeData.name}</h2>
                    </div>

                    <div className="w-full h-fit py-2 flex flex-col text-[3.3vw] pt-0 mt-5 sm:text-xl mt:3">
                        {weatherData}
                    </div>
                </div>
            )
        }
    }
}

export default Weather;
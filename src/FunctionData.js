export let link = [
    {
        name: 'current-condition',
        setlink: (lat, long) => `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${process.env.REACT_APP_API_KEY}&units=metric`,
        func: (d, setPlaceData) => {
            setPlaceData(prev => {
                return ({
                    temp: d.main.temp,
                    feels_like: d.main.feels_like,
                    temp_max: d.main.temp_max,
                    temp_min: d.main.temp_min,
                    weather: d.weather[0].description,
                    name: d.name,
                    country: d.sys.country
                })
            })
        }
    },
    {
        name: 'forecast-hourly',
        setlink: (lat, long) => `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${process.env.REACT_APP_API_KEY}&units=metric`,
        func: (d, setPlaceData, forecast, setForecast) => {            
            setPlaceData(prev => {
                prev.name = d.city.name;
                prev.country = d.city.country;
                return prev;
            })

            if (forecast !== []){
                setForecast(forecast = []);
            }

            for (let i = 0; i < d.list.length; i++){
                let time = d.list[i].dt_txt.split(' ');

                setForecast(prev => prev.concat(...[
                    <div className="p-2" key={'weather-' + i}>
                        <h2 className="font-bold">{d.list[i].weather[0].description}</h2>
                        <p>{time[1]}, {time[0]}</p>
                        <p>{d.list[i].main.temp}&#176;C but feels like {d.list[i].main.feels_like}&#176;C</p>
                        <p>{d.list[i].main.temp_min}&#176;C - {d.list[i].main.temp_max}&#176;C</p>
                    </div>
                ]))
            }
        }
    },
    {
        name: 'forecast-daily',
        setlink: (lat, long) => `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${process.env.REACT_APP_API_KEY}&units=metric`,
        func: (d, setPlaceData, forecast, setForecast) => {
            setPlaceData(prev => {
                prev.name = d.city.name;
                prev.country = d.city.country;
                return prev;
            })

            if (forecast !== []){
                setForecast(forecast = []);
            }

            let defaultTime = '09:00:00';
            for (let i = 0; i < d.list.length; i++){
                let time = d.list[i].dt_txt.split(' ');

                if (time[1] === defaultTime){
                    setForecast(prev => prev.concat(...[
                        <div className="p-2" key={'weather-' + i}>
                            <h2 className="font-bold">{d.list[i].weather[0].description}</h2>
                            <p>{time[1]}, {time[0]}</p>
                            <p>{d.list[i].main.temp}&#176;C but feels like {d.list[i].main.feels_like}&#176;C</p>
                            <p>{d.list[i].main.temp_min}&#176;C - {d.list[i].main.temp_max}&#176;C</p>
                        </div>
                    ]))
                }
            }
        }
    }
];
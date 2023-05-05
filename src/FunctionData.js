export let link = [
    {
        name: 'current-condition',
        setlink: (l) => `https://dataservice.accuweather.com/currentconditions/v1/${l}?apikey=${process.env.REACT_APP_API_KEY}`,
        func: (d, setPlaceData) => {
            let dateTimeInfo = d[0].LocalObservationDateTime.split(/[T+]/);

            setPlaceData(prev => {
                return ({
                    time: dateTimeInfo[1],
                    date: dateTimeInfo[0],
                    name: prev.name,
                    weather: d[0].WeatherText,
                    temperature: d[0].Temperature.Metric.Value
                })
            })
        }
    },
    {
        name: 'forecast-hourly',
        setlink: (l) => `https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${l}?apikey=${process.env.REACT_APP_API_KEY}&metric=true`,
        func: (d, setWeatherData) => {
            setWeatherData(prev => {
                if (prev.length > 0 || !Array.isArray(prev)){
                    prev = [];
                }

                for (let i = 0; i < d.length; i++){
                    let dateTime = d[i].DateTime.split(/[T+]/);

                    prev = prev.concat(...[
                        <div className="mx-3" key={i}>
                            <p>{dateTime[0]} {dateTime[1]}</p>
                            <p>{d[i].IconPhrase}</p>
                            <p>{d[i].Temperature.Value}&#176;C</p>
                        </div>
                    ]);
                }
                return prev;
            })
        }
    },
    {
        name: 'forecast-daily',
        setlink: (l) => `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${l}?apikey=${process.env.REACT_APP_API_KEY}&metric=true`,
        func: (d, setWeatherData) => {
            setWeatherData(prev => {
                if (prev.length > 0 || !Array.isArray(prev)){
                    prev = [];
                }

                let forecast = d.DailyForecasts;

                for (let i = 0; i < forecast.length; i++){
                    let dateTime = forecast[i].Date.split(/[T+]/);

                    prev = prev.concat(...[
                        <div className="mx-3" key={i}>
                            <p>{dateTime[0]} {dateTime[1]}</p>
                            <p>Day: {forecast[i].Day.IconPhrase}</p>
                            <p>Night: {forecast[i].Night.IconPhrase}</p>
                            <p>{forecast[i].Temperature.Minimum.Value}&#176;C</p>
                            <p>{forecast[i].Temperature.Maximum.Value}&#176;C</p>
                        </div>
                    ]);
                }
                
                return prev;
            })
        }
    }
];
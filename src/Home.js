import "./style/Home.css";
import {useState} from "react";


let Home = () => {
    let [data, setData] = useState([]);

    let clicked = async (cityData, code) => {
        return await fetch(`https://dataservice.accuweather.com/forecasts/v1/daily/5day/${code}?apikey=${process.env.REACT_APP_WEBSITE_API_KEY}&metric=true`)
        .then(res => res.json())
        .then(d => {
            setData(prev => {
                return prev = [<h2 key="title" className="mt-5 font-bold">{cityData.city}, {cityData.province}, {cityData.country}</h2>]
            })

            d.DailyForecasts.map((d2, index) => {
                if (data.length > 0){
                    setData(data = []);
                }

                return setData(prev => {
                    return prev.concat(
                        <div className="mt-3" key={index}>
                            <p>{d2.Date}</p>
                            <p>Day Weather : {d2.Day.IconPhrase}</p>
                            <p>Night Weather : {d2.Night.IconPhrase}</p>
                            <p>{d2.Temperature.Minimum.Value} C - {d2.Temperature.Maximum.Value} C</p>
                        </div>
                    )
                })
            })
        })
        .catch(err => {
            setData(prev => prev = [err.message])
            throw Error(err.message);
        });
    }

    let submitted = async (event) => {
        event.preventDefault();
        let city = event.target.city.value;

        if (data.length > 0){
            setData(data = []);
        }

        return await fetch(`https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${process.env.REACT_APP_WEBSITE_API_KEY}&q=${city}&offset=100`)
        .then(res => res.json())
        .then(d => {
            if (d.length === 0){
                setData(prev => prev.concat(<p key="haha">City Not Found</p>))
            }

            else{
                d.map((d, index) => {
                    return setData(prev => {
                        return prev.concat(
                            <div key={index} className="font-normal hover:font-bold cursor-pointer" 
                            onClick={() => clicked({
                                city : d.EnglishName,
                                province : d.AdministrativeArea.EnglishName,
                                country : d.Country.EnglishName,
                            }, d.Key)}>
                                <p>{d.EnglishName}, {d.AdministrativeArea.EnglishName}, {d.Country.EnglishName}</p>
                            </div>
                        )
                    })
                })
            }
        })
        .catch(err => {
            setData(prev => prev = [err.message])
            throw Error(err.message);
        });
    }

    return (
        <div className="p-4">
            <form onSubmit={submitted}>
                <input id="city" className="border-2 p-1" />
                <button className="block mt-3 mb-3 p-2 border-2">Search</button>
            </form>

            {data}
        </div>
    )
}

export default Home;
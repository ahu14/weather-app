import "./style/Home.css";
import {useState, useEffect} from "react";

let Template = ({isOn, title, date, data}) => {
    switch (isOn) {
        case false:
            return (
                <div className="flex w-full h-screen justify-center items-center">
                    <div className="w-24 h-24 border-8 rounded-full border-r-amber-200 
                    border-t-amber-300 border-l-amber-400 border-b-amber-500 animate-spin"></div>
                </div>
            )

        default :
            return (
                <>
                    <div className="font-bold text-xl text-center mt-3">
                        <h2>{title}</h2>
                        <h2>{date}</h2>
                    </div>

                    <div className="p-2 grid w-full h-screen justify-center items-center text-center">
                        <div className="w-fit h-full grid grid-flow-cols sm:grid-cols-3">
                            {data}
                        </div>
                    </div>
                </>
            )
    }
}

let Home = () => {
    let [data, setData] = useState([]);
    let [date, setDate] = useState("");
    let [title, setTitle] = useState("");
    let [isOn, setIsOn] = useState(navigator.onLine);
    
    useEffect(() => {
        let checkSignal = () => {
            setIsOn(isOn = navigator.onLine);
            requestAnimationFrame(checkSignal);
        }

        requestAnimationFrame(checkSignal);
    }, []);


    useEffect(() => {
        let showPosition = (pos) => {
            let longitude = pos.coords.longitude;
            let latitude = pos.coords.latitude;

            fetch(`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${process.env.REACT_APP_API_KEY}&q=${latitude}%2C${longitude}`)
            .then(res => res.json())
            .then(d => {
                if (title != "" || data.length != 0 || date != ""){
                    setTitle(title = "");
                    setData(data = []);
                    setDate(date = "");
                }

                setTitle(
                    title = `${d.LocalizedName}, ${d.ParentCity.LocalizedName}, 
                    ${d.AdministrativeArea.LocalizedName}, ${d.Country.LocalizedName}`
                );

                fetch(`http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${d.Key}?apikey=${process.env.REACT_APP_API_KEY}&metric=true`)
                .then(res => res.json())
                .then(d2 => {
                    for (let i = 0; i < d2.length; i++){
                        let dateTimeInfo = d2[i].DateTime.split(/[T+]/);

                        setDate(date = dateTimeInfo[0]);
                        setData(prev => prev.concat([
                            <div key={i} className="px-7 mt-3 p-3 text-l border-2 border-amber-300 rounded sm:mx-2 px-5 py-7">
                                <h2>{dateTimeInfo[1]}</h2>
                                <p>{d2[i].IconPhrase}</p>
                                <p>{d2[i].Temperature.Value}&#176;{d2[i].Temperature.Unit}</p>
                            </div>
                        ]))
                    }
                })
                .catch(err => console.log(err.message));
            })
            .catch(err => console.log(err.message));
        }

        navigator.geolocation.getCurrentPosition(showPosition);
    }, [isOn == true]);


    return <Template isOn={isOn} title={title} date={date} data={data} />
}

export default Home;
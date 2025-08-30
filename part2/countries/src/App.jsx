import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

const CountryInfo = ({info, weather}) => {
  return (
    <div style={{fontSize: "20px"}}>
      <h1>{info.name.common}</h1>

      <div>
        Capital {info.capital[0]}<br />
        Area {info.area}
        </div>

      <h2>Languages</h2>

      <ul>
        {Object.entries(info.languages).map(lang => <li key={lang[0]}>{lang[1]}</li>)}
      </ul>

      <img src={info.flags.png} alt={info.flags.alt} />

      <h2>Weather in {info.name.common}</h2>

      <div>
        Temperature {(weather?.main.temp - 273.15).toFixed(1)} Celsius <br />
        <img src={`https://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`} alt={weather?.weather.main} /><br/>
        Wind {weather?.wind.speed} m/s
      </div>

    </div>
  )

}

function App() {
  const [searchText, setSearchText] = useState('');
  const [countries, setCountries] = useState(null);
  const [weather, setWeather] = useState(null)
  
  const handleChange = (event) => {
    event.preventDefault();
    setSearchText(event.target.value);
    }

  useEffect(()=> {
    axios.get(` https://studies.cs.helsinki.fi/restcountries/api/all`)
    .then(response => {
      setCountries(response.data)
    })
  },[]);

  const showInfo = (countryName) => {
    setSearchText(countryName)
  }

  const filterCountries = searchText && countries ?
        countries.filter(c => {
        const name = c.name.common.toLowerCase()
        return name.includes(searchText.toLowerCase())
      }) : 
        [];
  
  const tooManyMatches = filterCountries.length > 10
  const onlyMatch = filterCountries.length === 1

  useEffect(() => {
  if(onlyMatch){
    const query = filterCountries[0].name.common
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${query}&&appid=${import.meta.env.VITE_SOME_KEY}`)
    .then(response => {
      setWeather(response.data)
    })
  }
  },[searchText])
  
  

  return (
    <div>
      <div>find countries <input value={searchText} onChange={handleChange} /></div>
      {tooManyMatches ? (
        <div>Too many matches, specify another filter</div>
      ) : onlyMatch ? (
        <CountryInfo info={filterCountries[0]} weather={weather} />
      ) : (
        filterCountries.map(c => <div key={c.ccn3}>{c.name.common} <button onClick={() => showInfo(c.name.common)}>Show</button></div>)
      )}
      
    </div>
  )
}

export default App

import React, { useState } from "react";
import './styles.css';

const apiKey = 'ee42025684459308f073b1cc34dab9a5';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}'

function WeatherView( {cards} ) {
    const cardArray = [];

    for(const key in cards) {
        cardArray.push(
            <div className="weatherCard">
                <div className="cityName">
                    { cards[key].name }
                </div>
                <div className="temperature">
                    { Math.round(cards[key].main.temp) } °C
                </div>
            </div>
        );
    }

    return cardArray;
}

function Home() {
    let initialCards = {};

    for(const key in localStorage) {
        if(key != 'length' && key != 'clear' && key != 'getItem' && key != 'key' &&
        key != 'removeItem' && key != 'setItem') {
            initialCards[key] = JSON.parse(localStorage.getItem(key));
        }
    }

    const [cards, setCards] = useState(initialCards);

    function requestWeather() {
        let searchString = document.getElementById("searchString").value;
        let cities = searchString.split(',');
        cities = cities.map((el) => { return el.trim() });
        for(const key in cards) {
            if(!(key in cities)) {
                cities.push(key);
            }
        }
    
        cities = cities.filter(n => n);

        let newState = {};

        cities.forEach((cityName) => {
            
            cityName = cityName.toLowerCase();
            if(localStorage.getItem(cityName) != null) {
                newState[cityName] = JSON.parse(localStorage.getItem(cityName));
            }
            if(!(cityName in newState) || ( cityName in newState && newState[cityName].expires < new Date().getTime())) { 
                let uri = eval('`' + apiUrl + '`');
                fetch(uri)
                    .then(res => res.json())
                    .then(data => {
                        data['expires'] = new Date().getTime() + 60 * 1000; // Устареет через минуту
                        newState[cityName] = data;
                        localStorage.setItem(cityName, JSON.stringify(data));
                        setCards((prevState) => {
                            for(const key in newState) {
                                prevState[key] = newState[key];
                            }
                            return Object.assign({}, prevState);
                        });
                });
            }
        });
    }

    function handleKey(e) {
        if(e.key == 'Enter') {
            requestWeather();
        }
    }

    return (
        <div className="container">
            <div className="weather">
                <div className="search">
                    <input id="searchString" type="text" placeholder="Введите города" onKeyDown={ handleKey }/>
                    <button onClick={ requestWeather }>Поиск</button>
                </div> 
                <WeatherView cards={cards} />     
            </div>
        </div>
    );
}

export default Home;
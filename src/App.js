import React from 'react';

import places from 'places.js';
import './App.css';
import moment from 'moment' ; 
import "moment/locale/fr" ; 


function App() {
 
  const [city , setCity] = React.useState("") ;
  const [data,setData] = React.useState([]) ; 
  const [weather,setWeather] = React.useState(null) ;

  const key = "1d5cfbb4b1ba74f6287033207b5f59d7" ; 

  const iconLink = "https://darksky.net/images/weather-icons/"

  React.useEffect(()=> {
    getPlaces(); 
   },[]) ;

   async function getWeather(suggestion) {
     const proxy = "https://cors-anywhere.herokuapp.com/"
     let apiUrl = `https://api.darksky.net/forecast/${key}/${suggestion.latlng.lat},${suggestion.latlng.lng}?lang=fr&units=ca`;
     const data = await fetch(proxy + apiUrl) ; 
     const resData = await data.json() ; 
     
     //  console.log(resData) ; 

     const weatherData = {
      time : resData.currently.time ,
      icon :  `${resData.currently.icon}.png` ,
      humidity : resData.currently.humidity , 
      temperature : `${resData.currently.temperature} C` ,
      summary :  resData.currently.summary
    }

    setWeather(weatherData) ;
    setData(resData.daily.data) ; 
   
   }

   function convert_timestamp(time) {
    let day = moment.unix(time).locale("fr").utc();
    return day.format("dddd MMM Do") ; 

   }

  function getPlaces() {
    let placesAutocomplete = places ({
      appId : "plQ12AI1XP6D" ,
      apiKey : "fe70c5c04d6c9c3fa4d5a582add1e634" , 
      container : document.querySelector("#address-input"), 
     }) ; 


     placesAutocomplete.on("change" , function(e) {
       getWeather(e.suggestion) ;
     })
    }

  return (
    <div className="container">
      <div className="row my-4">
        <div className="col-md-6 mx-auto" >
          <div className="card bg-white text-dark" >
            <div className="card-header" > 
                <h3 className ="card-title mt-2 text-center" > React Weather </h3>
            </div>
            <div className="card-body" >
              <div className="row" >
                <div className="col-md-12" >
                  <div className = "form-group" >
                          <input type="search" id="address-input" placeholder="Where are we going?" onChange={event=> setCity(event.target.value)} />

                  </div>
                </div>
              </div>

              {
                weather!== null && (
                   <div className ="weather border-bot " >
                     <div className = "weather-header " > 
                     
                     <img src= {iconLink + weather.icon} 
                     alt = "icon" 
                     width= "80"
                     height = "80" 
                     className= "img-fluid" />
                      <h3 className="temperature mr-2 font-weight" >
                        {weather.temperature}
                      </h3>
                      <h3 className = "temperature mr-2 font-weight-bold" > 
                      {moment().calendar()} 
                      </h3>
                      {console.log(data)}
                <h5 className="font-weight-bold" > {weather.summary} </h5>
                     </div>
                   </div>

                )
              }

              <div className="row" >
                 { 
                 data !==null && (
                   data.map(day => (

                      <div className="col-md-3 mb-1"  key ={day.time}>
                        <div className ="day" > 
                        <span className ="text-dark font-weight-bold" >
                          { convert_timestamp(day.time)}
                        </span>
                        <img src= {iconLink + day.icon +".png"} 
                     alt = "icon" 
                     width= "50"
                     height = "50" 
                     className= "img-fluid" />

                     <span className="text-dark" >
                       Min : { Math.round(day.temperatureLow) + "C"}
                     </span>
                     <span className="text-dark" >
                       Max : { Math.round(day.temperatureMax) + "C"}
                     </span>

                        </div> 

                        
                      </div>
                    
                   ))
                  


                 )



                 }


              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}

export default App;

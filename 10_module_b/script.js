console.clear()

//
var h1 = $("#h1")
var h2 = $("#h2")
var list = {
  "Rainy" : "rainy.svg",
  "Cloudy" : "cloudy.svg",
  "Sunny" : "sunny.svg"
}

function cardfill(idx, date, imgurl, weather, temp){
  $('.card:nth-child(' + idx + ')').html('<div class="date"></div><img src="" alt=""/><div class="weather"> </div><div class="temp"></div>')
  console.log(idx + ' work')
  $('.card:nth-child(' + idx + ") .date").html(date)
  $('.card:nth-child(' + idx + ") img").attr('src',imgurl)
  $('.card:nth-child(' + idx + ") .weather").html(weather)
  $('.card:nth-child(' + idx + ") .temp").html(temp)
}

h1.click(function(){
  $(".page2").addClass("dbn")
  $(".page1").removeClass("dbn")
  $(".loc").removeClass("dbn")
})
h2.click(function(){
  $(".page1").addClass("dbn")
  $(".loc").addClass("dbn")
  $(".page2").removeClass("dbn")
})

fetch("https://dev.makzan.net/module_b_api.php/cities.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Could not fetch resource");
        }
        return response.json();
    })
    .then(locationlist => {
        let radios = locationlist.map((city, index) => `
            <div class="city-radio">
                <input type="radio" id="radio-${city}" name="city" value="${city}" class="city-radio-input" ${index === 0 ? 'checked' : ''}>
                <label for="radio-${city}">${city}</label>
            </div>
        `).join('');
        $("#cityRadios").html(radios);

        // 初始化顯示第一個城市的天氣
        useLocation(locationlist[0]);

        $(".city-radio-input").change(function() {
            let selectedCity = $(".city-radio-input:checked").val();
            $(".loc").html(selectedCity)
            useLocation(selectedCity);
        });
    })
    .catch(error => console.error("Error:", error));

async function useLocation(loc) {
    console.log("使用的城市:", loc);
    try {
        const res = await fetch(`https://dev.makzan.net/module_b_api.php/weather.json?city=${loc}`);
        const locdata = await res.json();
        for(var i = 0; i < locdata.length; i++){
          cardfill(i+1, locdata[i].date, list[locdata[i].status], locdata[i].status, locdata[i].upper_temperature + " - " + locdata[i].lower_temperature + "°C")
        }
        //displayWeather(locdata, loc);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// function displayWeather(data, city) {
//     const weatherDataDiv = document.getElementById('weatherDataList');
//     const cityWeather = `
//         <div class="weather-day">
//             <h3>${city}</h3>
//             ${data.map(day => `
//                 <p>${day.date}</p>
//                 <p>${day.status}</p>
//                 <p>${day.upper_temperature}°C / ${day.lower_temperature}°C</p>
//             `).join('')}
//         </div>
//     `;
//     weatherDataDiv.innerHTML = cityWeather; // 替換為新的天氣資訊
// }
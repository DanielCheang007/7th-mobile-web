let currentCity = 'Macao'; 
let weatherData = null; // 用于存储当前城市的天气数据
let rainInterval; 
let cloudInterval; 
let sunRay; 

async function fetchCities() {
    const response = await fetch('https://dev.makzan.net/module_b_api.php/cities.json');
    const cities = await response.json();
    const citySelect = document.getElementById('city');
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
}

async function fetchWeather(city) {
    const response = await fetch(`https://dev.makzan.net/module_b_api.php/weather.json?city=${city}`);
    return await response.json(); // 返回获取的天气数据
}

async function switchCity() {
    const city = document.getElementById('city').value;
    if (city && city !== currentCity) {
        currentCity = city;
        weatherData = await fetchWeather(currentCity); // 获取新城市的天气数据
        displayWeather(weatherData, currentCity);
    }
}

function displayWeather(data, city) {
    const weatherContainer = document.getElementById('weatherContainer');
    const weatherDetails = document.getElementById('weatherDetails');
    const selectedCity = document.getElementById('selectedCity');
    
    selectedCity.textContent = `${city} 的天气预报`; // 显示当前城市
    weatherContainer.innerHTML = ''; 
    weatherDetails.style.display = 'none'; 

    data.forEach(day => {
        const weatherCard = document.createElement('div');
        weatherCard.className = 'weather-card';
        weatherCard.innerHTML = `
            <h3>${day.date}</h3>
            <img class="weather-icon" src="${getWeatherIcon(day.status)}" alt="${day.status}">
            <p>${day.status}</p>
            <p>${day.lower_temperature}°C - ${day.upper_temperature}°C</p>
        `;
        weatherCard.onclick = () => showWeatherDetails(day); 
        weatherContainer.appendChild(weatherCard);
    });

    // 初始化显示当天天气的特效
    if (data.length > 0) {
        showWeatherDetails(data[0]); // 显示第一天的天气详情
    }
}

function showWeatherDetails(day) {
    const weatherDetails = document.getElementById('weatherDetails');
    weatherDetails.innerHTML = `
        <h3>${day.date} 的天气详情</h3>
        <p>天气状态: ${day.status}</p>
        <p>最低温度: ${day.lower_temperature}°C</p>
        <p>最高温度: ${day.upper_temperature}°C</p>
        <p>温度范围: ${day.lower_temperature}°C - ${day.upper_temperature}°C</p>
        <button onclick="hideWeatherDetails()">关闭详情</button>
    `;
    weatherDetails.style.display = 'block'; 

    // 处理天气特效
    if (day.status === 'Rainy') {
        startRainEffect();
    } else {
        stopRainEffect(); 
    }

    if (day.status === 'Cloudy') {
        startCloudEffect();
    } else {
        stopCloudEffect(); 
    }

    if (day.status === 'Sunny') {
        startSunshineEffect();
        startCloudEffect(1); // 生成1个云朵
    } else {
        stopSunshineEffect(); 
    }
}

function hideWeatherDetails() {
    const weatherDetails = document.getElementById('weatherDetails');
    weatherDetails.style.display = 'none'; 
    stopRainEffect(); 
    stopCloudEffect(); 
    stopSunshineEffect(); 
}

function getWeatherIcon(status) {
    switch (status) {
        case 'Sunny':
            return 'sunny.svg'; 
        case 'Rainy':
            return 'rainy.svg'; 
        case 'Cloudy':
            return 'cloudy.svg'; 
        default:
            return '';
    }
}

async function showWeather() {
    document.getElementById('weatherInterface').style.display = 'block';
    document.getElementById('locationInterface').style.display = 'none';
    if (!weatherData) {
        weatherData = await fetchWeather(currentCity); // 默认获取澳门的天气
    }
    displayWeather(weatherData, currentCity); // 显示当前城市的数据
}

function showLocation() {
    document.getElementById('weatherInterface').style.display = 'none';
    document.getElementById('locationInterface').style.display = 'block';
}

function startRainEffect() {
    if (rainInterval) return; 

    rainInterval = setInterval(() => {
        for (let i = 0; i < 5; i++) { 
            createRaindrop();
        }
    }, 100); 
}

function createRaindrop() {
    const raindrop = document.createElement('div');
    raindrop.className = 'raindrop';
    raindrop.style.left = Math.random() * 100 + 'vw'; 
    raindrop.style.animationDuration = (Math.random() * 1 + 0.5) + 's'; 
    document.body.appendChild(raindrop);
    
    setTimeout(() => {
        raindrop.remove();
    }, 2000); 
}

function stopRainEffect() {
    clearInterval(rainInterval); 
    rainInterval = null; 
    const raindrops = document.querySelectorAll('.raindrop');
    raindrops.forEach(raindrop => raindrop.remove()); 
}

function startCloudEffect(count = 1) { // 允许传入云的数量
    if (cloudInterval) return; 

    cloudInterval = setInterval(() => {
        for (let i = 0; i < count; i++) {
            createCloud();
        }
    }, 1000); 
}

function createCloud() {
    const cloud = document.createElement('div');
    cloud.className = 'cloud';
    cloud.style.width = Math.random() * 100 + 50 + 'px'; 
    cloud.style.height = Math.random() * 30 + 10 + 'px'; 
    cloud.style.top = Math.random() * 40 + 'vh'; 
    cloud.style.left = '-100px'; 
    cloud.style.animationDuration = (Math.random() * 5 + 5) + 's'; 
    document.body.appendChild(cloud);

    setTimeout(() => {
        cloud.remove();
    }, 20000); 
}

function stopCloudEffect() {
    clearInterval(cloudInterval); 
    cloudInterval = null; 
    const clouds = document.querySelectorAll('.cloud');
    clouds.forEach(cloud => cloud.remove()); 
}

function startSunshineEffect() {
    if (sunRay) return; 

    sunRay = document.createElement('div');
    sunRay.className = 'sun-ray';
    sunRay.style.left = '90%'; // 调整太阳光线的位置到右上角
    sunRay.style.top = '15%'; 
    sunRay.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(sunRay);
}

function stopSunshineEffect() {
    if (sunRay) {
        sunRay.remove(); 
        sunRay = null; 
    }
}

// 初始化时显示澳门天气
window.onload = async function() {
    await fetchCities();
    weatherData = await fetchWeather(currentCity); // 默认获取澳门的天气
    displayWeather(weatherData, currentCity);
    showWeather(); // 显示天气界面
};

async function switchCity() {
    const city = document.getElementById('city').value;
    if (city && city !== currentCity) {
        currentCity = city;
        weatherData = await fetchWeather(currentCity); // 获取新城市的天气数据
        displayWeather(weatherData, currentCity);
        showWeather(); // 自动跳回天气预报界面
    }
}

function hideWeatherDetails() {
    const weatherDetails = document.getElementById('weatherDetails');
    weatherDetails.style.display = 'none'; 
    stopRainEffect(); 
    stopCloudEffect(); 
    stopSunshineEffect(); 
    createFireworks(); // 添加烟花效果
}

function createFireworks() {
    for (let i = 0; i < 10; i++) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.left = Math.random() * 100 + 'vw'; // 随机位置
        firework.style.bottom = Math.random() * 30 + 'vh'; // 随机高度
        document.body.appendChild(firework);
        
        // 在动画结束后移除烟花元素
        setTimeout(() => {
            firework.remove();
        }, 1000); 
    }
}
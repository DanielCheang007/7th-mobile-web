function $(selector) {
    return document.querySelector(selector);
  }

var settingBtt = $("#settingbtt");
var mainBtt = $("#mainbtt");
var mainPage = $("#main");
var settingPage = $("#setting");
var weatherList;
var cityViewing = 'Macao';
getData("Macao");
$("#header").innerHTML = cityViewing;
mainBtt.onclick = function() {
    mainPage.classList.add("show");
    settingPage.classList.remove("show");
    $("#header").innerHTML = cityViewing;
};

settingBtt.onclick = function() {
    settingPage.classList.add("show");
    mainPage.classList.remove("show");
};

async function getData(city) {
    try {
        const response = await fetch(`https://dev.makzan.net/module_b_api.php/weather.json?city=${city}`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error while fetching data:', error);
        throw error;
    }
}

async function showWeather() {
    try {
        const data = await getData(cityViewing);
        for (let index = 0; index < 7; index++) {
            console.log(index);
            var dateElem = $(`#data${index + 1}`);
            dateElem.innerHTML = `date: ${data[index].date}`
            if (data[index].status === 'Rainy') {
                $(`#image${index + 1}`).src = "./main/svnicons/rainy.svg"
            } else if (data[index].status === 'Cloudy') {
                $(`#image${index + 1}`).src = "./main/svnicons/cloudy.svg"
            } else {
                $(`#image${index + 1}`).src = "./main/svnicons/sunny.svg"
            };
            var info = ''
            info = `${data[index].status}\n${data[index].lower_temperature}°C ~ ${data[index].upper_temperature}°C`
            $(`#info${index + 1}`).innerHTML = info
        }
    } catch (error) {
        console.error('Error while fetching data:', error);
    }
}

function getSelectedValue() {
    var selectedOption = document.querySelector('input[name="radiolist"]:checked');
    
    if (selectedOption) {
      console.log("Selected value: ", selectedOption.value);
    } else {
      console.log("No option selected");
    }
    cityViewing = selectedOption.value
    $("#header").innerHTML = cityViewing;
    showWeather()
};





const swiper = document.querySelector('.swiper');
        const dots = document.querySelectorAll('.dot');
        let startX = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let isDragging = false;
        let currentIndex = 0;

        // Touch events
        swiper.addEventListener('touchstart', touchStart);
        swiper.addEventListener('touchmove', touchMove);
        swiper.addEventListener('touchend', touchEnd);

        // Mouse events
        swiper.addEventListener('mousedown', touchStart);
        swiper.addEventListener('mousemove', touchMove);
        swiper.addEventListener('mouseup', touchEnd);
        swiper.addEventListener('mouseleave', touchEnd);

        function touchStart(event) {
            startX = getPositionX(event);
            isDragging = true;
            swiper.style.transition = 'none';
        }

        function touchMove(event) {
            if (!isDragging) return;
            
            const currentPosition = getPositionX(event);
            const diff = currentPosition - startX;
            currentTranslate = prevTranslate + diff;
            
            setSliderPosition(currentTranslate);
        }

        function touchEnd() {
            isDragging = false;
            swiper.style.transition = 'transform 0.3s ease-out';

            const moveBy = currentTranslate - prevTranslate;
            
            if (Math.abs(moveBy) > 100) {
                if (moveBy > 0 && currentIndex > 0) {
                    currentIndex--;
                } else if (moveBy < 0 && currentIndex < 6) {
                    currentIndex++;
                }
            }

            currentTranslate = currentIndex * -window.innerWidth;
            prevTranslate = currentTranslate;
            setSliderPosition(currentTranslate);
            updateDots();
        }

        function getPositionX(event) {
            return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        }

        function setSliderPosition(position) {
            swiper.style.transform = `translateX(${position}px)`;
        }

        function updateDots() {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        // Click events for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                currentTranslate = currentIndex * -window.innerWidth;
                prevTranslate = currentTranslate;
                setSliderPosition(currentTranslate);
                updateDots();
            });
        });

        // Prevent context menu on long press
        window.addEventListener('contextmenu', e => e.preventDefault());

        showWeather()
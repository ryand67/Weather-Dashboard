$(document).ready(function() {
    //Grabbing parts of the page
    var mainTitle = $("#mainTitle");
    var currentIcon = $("#currentIcon");
    var currentTemp = $("#currentTemp");
    var currentHum = $("#currentHum");
    var currentWS = $("#currentWS");
    var currentUV = $("#currentUV");
    var searchInput = $("#searchInput")
    var fiveDayDiv = $("#five-day-div");
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

    //Passes the place into a function that will call the api and then update the different parts of the forecast and creates the 5 day forecast boxes
    function updateWeather(place) {
        //Gather current date info to be displayed
        var dateVar = new Date();
        var month = dateVar.getMonth() + 1;
        var day = dateVar.getDate();
        var year = dateVar.getFullYear();
        //ajax function to grab the weather for the current day
        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/weather?q=' + place + '&units=imperial&appid=7e6a0f7a8f2fee7813d7ade6f80a831b'
        }).then(function(response) {
            //Logs the response
            console.log(response);
            //Displays the city and the current date
            mainTitle.text(response.name + " Weather " + month + "/" + day + "/" + year);
            //Puts the icon next to the city and date
            // currentIcon.attr("src", "http://openweathermap.org/img/wn/11d@2x.png");
            //Sets the temperature
            currentTemp.text(response.main.temp.toFixed(1) + "°F");
            //Sets humidity
            currentHum.text(response.main.humidity + "%");
            //Sets windspeed
            currentWS.text(response.wind.speed + "MPH");
            //Sets UV index and color

        })
    }

    function renderHistory() {
        
    }

    function updateHistory(place) {
        var placeVar = place.charAt(0).toUpperCase() + place.toLowerCase().slice(1);
        searchHistory.push(placeVar);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        renderHistory();
    }

    //Search button updates the weather and the history, seperated the update/render functions because I don't need an entry to be added when the user clicks on it from teh side bar.
    $("#searchButton").on("click", function() {
        event.preventDefault();
        updateHistory($("#searchInput").val());
        updateWeather($("#searchInput").val());
    })

    //Binds the popular cities list to call the function that updates the weather
    $(document).on("click", "li", function() {
        updateWeather($(this).text());
    })
    
})
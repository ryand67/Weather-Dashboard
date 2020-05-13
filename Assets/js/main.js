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
    var searchHistoryList = $("#searchHistoryList");
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

            fiveDayRender(place);
        })
    }

    //Function that renders the five day forecast blocks
    function fiveDayRender(place) {
        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + place + '&units=imperial&appid=7e6a0f7a8f2fee7813d7ade6f80a831b',
            method: "GET"
        }).then(function(response) {
            console.log(response);
        })
    }

    function renderHistory() {
        //Clears the list space to avoid repeats
        searchHistoryList.html("");
        //Runs through the history array one by one
        searchHistory.forEach(function(e) {
            //Creates a new li and hr to add to the master list and appends to the appropriate div
            var newLI = $("<li>").text(e);
            var newHR = $("<hr>");
            searchHistoryList.prepend(newLI, newHR);
        })
    }

    //Adds the entry to the search history array
    function updateHistory(place) {
        //Makes sure the first character is capitalized and the rest is lowercase even if it's multiple words (eg LA, SF, etc)
        var placeVar = "";
        //Breaks up the city name by spaces
        place = place.split(" ");
        //Runs through each one of those, capitalizes the first letter, lowercases the rest, adds a space for the second word
        place.forEach(function(e) {
            placeVar += e.charAt(0).toUpperCase() + e.toLowerCase().slice(1) + " ";
        })
        //Gets rid of the extra space if it was only one word
        placeVar = placeVar.trim();
        //Adds the entry to the array
        searchHistory.push(placeVar);
        //If it's longer than 5 start getting rid of the other entries
        if(searchHistory.length >= 6) {
            searchHistory.shift();
        }
        //Update the localStorage of the search history
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        //Render the search history
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
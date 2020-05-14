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
            // console.log(response);
            //Displays the city and the current date
            mainTitle.text(response.name + " Weather " + month + "/" + day + "/" + year);
            //Puts the icon next to the city and date
            currentIcon.attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png");
            //Sets the temperature
            currentTemp.text(response.main.temp.toFixed(1) + "°F");
            //Sets humidity
            currentHum.text(response.main.humidity + "%");
            //Sets windspeed
            currentWS.text(response.wind.speed + "MPH");
            //Sets UV index and color and passes in the appropriate lat and lon
            getUV(response.coord.lat, response.coord.lon);
        })
        fiveDayRender(place);
    }

    //Takes in lat and lon coordinates to get the UV index
    function getUV(lat, lon) {
        //Calls on the api passing in the lat and lon in the url
        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/uvi?appid=7e6a0f7a8f2fee7813d7ade6f80a831b&lat='+ lat + '&lon=' + lon,
            method: "GET"
        }).then(function(response) {
            //Stores in a convenience variable
            var uvIndex = response.value;
            //Sets the text color to be read against the background
            currentUV.css("color", "var(--main-light)");
            //Sets the text value
            currentUV.text(uvIndex);
            //Sets the background color to the appropriate color based on uv index
            if(uvIndex <= 3.33) {
                currentUV.css("background-color", "var(--main-green)")
            } else if(uvIndex > 3.33 && uvIndex <= 6.66) {
                currentUV.css("background-color", "var(--main-yellow)")
            } else if(uvIndex > 6.66 && uvIndex <= 9.99) {
                currentUV.css("background-color", "var(--main-orange)");
            } else if(uvIndex >= 10) {
                currentUV.css("background-color", "var(--main-red)");
            }
        })
    }

    //Function that renders the five day forecast blocks
    function fiveDayRender(place) {
        //Variable holding the hours I need from the forecast.
        var forecastHours = [7, 15, 23, 31, 39]
        //Grab the forecast for the place
        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + place + '&units=imperial&appid=7e6a0f7a8f2fee7813d7ade6f80a831b',
            method: "GET"
        }).then(function(response) {
            console.log(response);
            fiveDayDiv.html("");
            forecastHours.forEach(function(e) {
                var newBox = $("<div>").addClass("five-day-box");
                var boxDate = $("<h2>").text(dateReformat(response.list[e].dt_txt.toString()))
                var boxIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + response.list[e].weather[0].icon + "@2x.png");
                var boxTemp = $("<p>").text("Temp: " + response.list[e].main.temp + "°F");
                var boxHum = $("<p>").text("Humidity: " + response.list[e].main.humidity + "%");
                newBox.append(boxDate, boxIcon, boxTemp, boxHum);
                fiveDayDiv.append(newBox);
            })
        })
    }

    function dateReformat(str) {
        var month = str.slice(5,7);
        var day = str.slice(8,10);
        var year = str.slice(0,4);
        var result = month + "/" + day + "/" + year;
        return result;
    }

    //Renders the search history on the screen
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

    //Search button updates the weather and the history, seperated the update/render functions because I don't need an entry to be added when the user clicks on it from the side bar.  Checks the user actually input something.
    $("#searchButton").on("click", function() {
        event.preventDefault();
        if(searchInput.val().trim() !== "") {
            updateHistory($("#searchInput").val().trim());
            updateWeather($("#searchInput").val().trim());
            searchInput.val("");
        }
    })

    //Binds the popular cities list to call the function that updates the weather
    $(document).on("click", "li", function() {
        updateWeather($(this).text());
    })
    
    renderHistory();
})
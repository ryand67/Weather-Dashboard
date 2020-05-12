$(document).ready(function() {
    //Grabbing parts of the page
    var mainTitle = $("#mainTitle");
    var currentCityTitle = $("#currentCity");
    var currentDateTitle = $("#currentDate");
    var currentTemp = $("#currentTemp");
    var currentHum = $("#currentHum");
    var currentWS = $("#currentWS");
    var currentUV = $("#currentUV");
    var searchInput = $("#searchInput")
    var fiveDayDiv = $("#five-day-div");

    

    //Search button updates the weather
    $("#searchButton").on("click", function() {
        event.preventDefault();
        updateWeather($("#searchInput").val());
    })

    //Binds the popular cities list to call the function that updates the weather
    $("td").on("click", function() {
        updateWeather($(this).text());
    })

    function updateWeather(place) {
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=7e6a0f7a8f2fee7813d7ade6f80a831b",
            Method: "GET"
        }).then(function(response) {
            console.log(response);
        })
        console.log(place);
    }
})
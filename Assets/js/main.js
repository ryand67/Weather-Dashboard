$(document).ready(function() {
    var mainTitle = $("#mainTitle");
    var currentTemp = $("#currentTemp");
    var currentHum = $("#currentHum");
    var currentWS = $("#currentWS");
    var currentUV = $("#currentUV");
    var searchInput = $("#searchInput")

    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=7e6a0f7a8f2fee7813d7ade6f80a831b",
        Method: "GET"
    }).then(function(response) {
        console.log(response);
    })

    $("#searchButton").on("click", function() {
        event.preventDefault();
        console.log($("#searchInput").text());
        updateWeather($("#searchInput").html());
    })

    function updateWeather(place) {
        console.log(place);
    }

    $("td").on("click", function() {
        updateWeather($(this).text());
    })
})
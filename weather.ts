//Joshua Dalton
//IT505

interface Weather { //interface for weather info
    temperature: number;
    windspeed: number;
    weathercode: number;
}

//gets weather for a city
async function getWeather(city: string) {
    try {
        //searches for city
        let cityURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;

        let cityResponse = await fetch(cityURL);

        //checks if request worked
        if (!cityResponse.ok) {
            throw new Error("Could not search for city.");
        }

        let cityData = await cityResponse.json();

        //checks if city exists
        if (!cityData.results || cityData.results.length === 0) {
            throw new Error("City not found.");
        }

        let location = cityData.results[0];

        let latitude = location.latitude;
        let longitude = location.longitude;

        //gets weather using city coordinates
        let weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph`;

        let weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Could not get weather.");
        }

        let weatherData = await weatherResponse.json();

        //stores weather info
        let weather: Weather = {
            temperature: weatherData.current.temperature_2m,
            windspeed: weatherData.current.wind_speed_10m,
            weathercode: weatherData.current.weather_code
        };

        //shows weather results
        console.log("\nWeather for " + location.name);
        console.log("Temperature: " + weather.temperature + "°F");
        console.log("Wind Speed: " + weather.windspeed + " mph");
        console.log("Conditions: " + getConditions(weather.weathercode));
        console.log("Date: " + new Date().toLocaleString());

    } catch (error) {
        //shows error if something goes wrong
        if (error instanceof Error) {
            console.log("Error: " + error.message);
        }
    } finally {
        //runs after request finishes
        console.log("Weather request finished.");
    }
}

//turns weather codes into conditions
function getConditions(code: number): string {
    if (code === 0) {
        return "Clear";
    } else if (code >= 1 && code <= 3) {
        return "Cloudy";
    } else if (code === 45 || code === 48) {
        return "Foggy";
    } else if (code >= 51 && code <= 67) {
        return "Rainy";
    } else if (code >= 71 && code <= 77) {
        return "Snowy";
    } else if (code >= 80 && code <= 82) {
        return "Rain Showers";
    } else if (code >= 95) {
        return "Thunderstorms";
    } else {
        return "Unknown";
    }
}

//keeps program running
let running = true;

//main menu
while (running) {
    console.log("\nWeather Forecast Application");
    console.log("1. Check Weather");
    console.log("2. Exit");

    let choice = prompt("Choose an option:");

    switch (choice) {
        case "1":
            //gets city from user
            let city = prompt("Enter a city:");

            if (city && city.trim() !== "") {
                await getWeather(city);
            } else {
                console.log("Please enter a city.");
            }
            break;

        case "2":
            running = false;
            break;

        default:
            console.log("Invalid option.");
    }
}

console.log("Goodbye!");
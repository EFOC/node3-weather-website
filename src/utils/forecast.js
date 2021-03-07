const request = require('request');

const getForecast = (lat, long, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=6f0fc3946d0751cc08aa1e8cf25492e1&query=' + encodeURIComponent(long) + ',' + encodeURIComponent(lat) + '&units=m';
    request({ url, json: true }, (error, response) => {
    
        if(error) {
            callback('Unable to connect to weather service!', undefined);

        } else if(response.body.error) {
            callback('Unable to connect to find location', undefined);
        } else {
            const temp = response.body.current.temperature;
            const feelsLike = response.body.current.feelslike;
            callback(undefined, `${response.body.current.weather_descriptions[0]}. It is ${temp} degrees outside. It feels like ${feelsLike}.`);
        }
    });
}

module.exports = getForecast
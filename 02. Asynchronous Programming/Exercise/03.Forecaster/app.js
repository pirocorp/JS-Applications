function attachEvents() {
    const locationsUrl = 'http://localhost:3030/jsonstore/forecaster/locations';
    const currentConditionsUrl = 'http://localhost:3030/jsonstore/forecaster/today';
    const upcommingConditionsUrl = 'http://localhost:3030/jsonstore/forecaster/upcoming';

    const locationElement = document.getElementById('location');
    const getWeatherElement = document.getElementById('submit');

    const forecastElement = document.getElementById('forecast');
    const currentConditionElement = document.getElementById('current');
    const upcommingConditionElement = document.getElementById('upcoming');

    getWeatherElement.addEventListener('click', onGetWeatherClickHandler); 
    
    async function onGetWeatherClickHandler() {
        forecastElement.style.display = 'block';
        currentConditionElement.innerHTML = '<div class="label">Loading...</div>';
        upcommingConditionElement.innerHTML = '<div class="label">Loading...</div>';

        let location = locationElement.value;        
        
        const response = await fetch(locationsUrl);
        const result = await response.json();

        location = result.find(e => e.name === location);

        if(!location) {
            return
        }

        getCurrentConditions(location.code);        
        getForecast(location.code);
    }

    // Next time will use function from the previous course
    async function getCurrentConditions(code) {
        const response = await fetch(`${currentConditionsUrl}/${code}`);
        const data = await response.json();

        const forecasts = document.createElement('div');
        forecasts.classList = 'forecasts';

        const conditionSymbolElement = document.createElement('span');
        conditionSymbolElement.classList = 'condition symbol';
        conditionSymbolElement.textContent = getConditionSymbol(data.forecast.condition);
        forecasts.appendChild(conditionSymbolElement);

        const conditionsElement = document.createElement('span');
        conditionsElement.classList = 'condition';

        const locationCondition = document.createElement('span');
        locationCondition.classList = 'forecast-data';
        locationCondition.textContent = data.name;
        conditionsElement.appendChild(locationCondition);

        const degreesCondition = document.createElement('span');
        degreesCondition.classList = 'forecast-data';
        degreesCondition.textContent = `${data.forecast.low}°/${data.forecast.high}°`;
        conditionsElement.appendChild(degreesCondition);

        const overalCondition = document.createElement('span');
        overalCondition.classList = 'forecast-data';
        overalCondition.textContent = data.forecast.condition;
        conditionsElement.appendChild(overalCondition);

        currentConditionElement.innerHTML = '<div class="label">Current conditions</div>';
        currentConditionElement.appendChild(forecasts);
        currentConditionElement.appendChild(conditionsElement);
    }

    async function getForecast(code) {
        const forecastInfoElement = document.createElement('div');
        forecastInfoElement.classList = 'forecast-info';

        const response = await fetch(`${upcommingConditionsUrl}/${code}`);
        const data = await response.json();

        data.forecast.forEach(element => {
            const {condition, high, low} = element;
            forecastInfoElement.appendChild(createForecastElement(condition, high, low));
        });

        upcommingConditionElement.innerHTML = '<div class="label">Three-day forecast</div>';
        upcommingConditionElement.appendChild(forecastInfoElement);
    }
}

function createForecastElement(condition, high, low) {
    const forecastElement = document.createElement('span');
    forecastElement.classList = 'upcoming';

    const symbolElement = document.createElement('span');
    symbolElement.classList = 'symbol';
    symbolElement.textContent = getConditionSymbol(condition);
    forecastElement.appendChild(symbolElement);

    const temeratureElement = document.createElement('span');
    temeratureElement.classList = 'forecast-data';
    temeratureElement.textContent = `${low}°/${high}°`;
    forecastElement.appendChild(temeratureElement);

    const conditionElement = document.createElement('span');
    conditionElement.classList = 'forecast-data';
    conditionElement.textContent = condition;
    forecastElement.appendChild(conditionElement);

    return forecastElement;
}

// How i miss C# switch expression :(
function getConditionSymbol(condition) {
    switch(condition){
        case 'Sunny':
            return '☀';
        case 'Partly sunny':
            return '⛅';
        case 'Overcast':
            return '☁';
        case 'Rain':
            return '☂';
    }
}

attachEvents();
async function getInfo() {
    const stopId = document.getElementById('stopId').value;

    const url = `http://localhost:3030/jsonstore/bus/businfo/${stopId}`;

    const stopNameElement = document.getElementById('stopName');
    const busesElement = document.getElementById('buses');

    try {
        stopNameElement.textContent = 'Loading...'
        busesElement.replaceChildren();
        const res = await fetch(url);

        if(res.status != 200) {
            throw new Error('Stop Id not found');
        }

        const data = await res.json();
        
        stopNameElement.textContent = data.name;

        for (const bus in data.buses) {
            const busElement = document.createElement('li');
            busElement.textContent = `Bus ${bus} arrives in ${data.buses[bus]} minutes`;

            busesElement.appendChild(busElement);
        }
    } catch(err) {
        stopNameElement.textContent = 'Error';        
    }
}

function promiseSolution() {
    const stopId = document.getElementById('stopId').value;

    const url = `http://localhost:3030/jsonstore/bus/businfo/${stopId}`;

    const stopNameElement = document.getElementById('stopName');
    const busesElement = document.getElementById('buses');

    fetch(url)
        .then(res => res.json())
        .then(data => {
            stopNameElement.textContent = data.name;
            busesElement.innerHTML = '';

            for (const bus in data.buses) {
                busElement = document.createElement('li');
                busElement.textContent = `Bus ${bus} arrives in ${data.buses[bus]} minutes`;

                busesElement.appendChild(busElement);
            }
        })
        .catch(err => {
            stopNameElement.textContent = 'Error';
            busesElement.innerHTML = '';
        });
}
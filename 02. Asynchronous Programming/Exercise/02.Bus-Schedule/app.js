function solve() {
    const url = 'http://localhost:3030/jsonstore/bus/schedule/';
    const infoElement = document.querySelector('#info .info');
    const departButton = document.getElementById('depart');
    const arriveButton = document.getElementById('arrive');

    let next = 'depot';  
    let stopName = '';

    async function depart() {
        const res = await fetch(url + next);
        const stop = await res.json();
        stopName = stop.name;
        
        infoElement.textContent = `Next stop ${stopName}`;
        next = stop.next;

        departButton.disabled = true;
        arriveButton.disabled = false;
    }

    function arrive() {
        infoElement.textContent = `Arriving at ${stopName}`;

        departButton.disabled = false;
        arriveButton.disabled = true;
    }

    return {
        depart,
        arrive
    };
}

let result = solve();
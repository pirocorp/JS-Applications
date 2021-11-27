import { createDomElement } from "./domUtilities.js";

const errorBox = document.getElementById('errorBox');
errorBox.replaceChildren();
errorBox.style.display = 'block';

errorBox.addEventListener('click', onNotificationClickEventHandler)

export async function simpleErrorHandler(func, ...params) {
    const response = await func(...params);

    if(response.success == false) {
        alert(response.data);        
    }

    return response
}

export async function notificationsErrorHandler(func, ...params) {
    const response = await func(...params);

    if(response.success == false) {
        showNotification(response.data);      
    }

    return response
}

export function showNotification(message) {
    const notification = createDomElement('span', {}, message);

    setTimeout(() => notification.remove(), 3000);

    errorBox.appendChild(notification);

    return notification;
}

function onNotificationClickEventHandler(event) {
    if(event.target.tagName == 'SPAN') {
        event.stopPropagation();
        event.target.remove();
    }
}
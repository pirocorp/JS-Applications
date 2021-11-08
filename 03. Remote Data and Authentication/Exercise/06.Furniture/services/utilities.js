export function createDomElement(type, attr, ...content) {
    const element = document.createElement(type);       

    // Adds element attributes
    Object.assign(element, attr);

    /* for (const prop in attr) {
        element[prop] = attr[prop];
    } */

    for (let item of content) {
        if(typeof(item) === 'string' 
        || typeof(item) === 'number') {
            item = document.createTextNode(item);
        }

        element.appendChild(item);
    }

    return element;
};
import { kebabize } from './stringUtilities.js';

export function createDomElement(type, attributes, ...content) {
    const element = document.createElement(type);       

    for(let [attr, value] of Object.entries(attributes || {})) {
        if(attr.substring(0, 2) == 'on') {
            element.addEventListener(attr.substring(2).toLocaleLowerCase(), value);
        } else if(attr.substring(0, 4) == 'data'){
            const dataAttribute = kebabize(attr);
            element.setAttribute(dataAttribute, value)
        } else {
            element[attr] = value;
        }
    }

    content = content.reduce((a, c) => a.concat(Array.isArray(c) ? c : [c]), []);

    for (let item of content) {
        if(typeof(item) === 'string' 
        || typeof(item) === 'number') {
            item = document.createTextNode(item);
        }

        element.appendChild(item);
    }

    return element;
};
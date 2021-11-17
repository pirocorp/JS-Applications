const section = document.getElementById('home-page');
section.remove();

const getStartedButtonElement = section.querySelector('#get-started-link');
getStartedButtonElement.addEventListener('click', onGetStartedButtonClickHandler);

let ctx;

export async function showHomePage(ctxTarget) {
    ctx = ctxTarget;
    ctx.showSection(section);
}

function onGetStartedButtonClickHandler(event) {
    event.preventDefault();
    ctx.goTo('catalog');
}
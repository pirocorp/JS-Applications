import postsService from "./services/postsService.js";
import { createDomElement } from './dom.js'

const topicForm = document.getElementById('topic-form');

const postButtonElement = document.getElementById('post-button');
postButtonElement.addEventListener('click', onPostButtonClickHandler);

const cancelButtonElement = document.getElementById('cancel-button');
cancelButtonElement.addEventListener('click', onCancelButtonClickHandler);

loadTopics();

async function loadTopics() {
    const postsContainerElement = document.getElementById('posts-container');

    const response = await postsService.getAll();

    if(!response.success) {
        alert(response.data);
        return;
    }

    console.log();
    postsContainerElement.replaceChildren(...Object.values(response.data).map(createPost));
}

function createPost(postData) {
    const postElement = createDomElement(
        'div', 
        { classList: 'topic-container' },
        createDomElement(
            'div', 
            { classList: 'topic-name-wrapper' },
            createDomElement(
                'div', 
                { classList: 'topic-name' },
                createDomElement(
                    'a', 
                    {herf: '#', classList: 'normal'}, 
                    createDomElement('h2', {}, postData.title)
                ),
                createDomElement(
                    'div', 
                    { classList: 'columns' },
                    createDomElement(
                        'div', 
                        {},
                        createDomElement(
                            'p', 
                            {},
                            'Date: ',
                            createDomElement('time', {}, postData.time)
                        ),
                        createDomElement(
                            'div',
                            { classList: 'nick-name'},
                            createDomElement(
                                'p', 
                                {},
                                'Username: ',
                                createDomElement('span', {}, postData.username)
                            )
                        )
                    ),
                    createDomElement('p', {}, postData.post)
                )
            )
        )
    );

    const post = createDomElement('a', { href: `/theme-content.html?postId=${postData._id}`}, postElement);
    post.style.color = 'inherit';
    post.style.textDecoration = 'none';

    return post;
}

async function onPostButtonClickHandler(event) {
    event.preventDefault();

    const formData = new FormData(topicForm);

    const title = formData.get('topicName');
    const username = formData.get('username');
    const post = formData.get('postText');
    const time = new Date();

    const data = {
        title,
        username,
        post,
        time
    };

    const response = await postsService.create(data);

    if(!response.success) {
        alert(response.data);
        return
    }

    topicForm.reset();
    await loadTopics();
}

function onCancelButtonClickHandler(event) {
    event.preventDefault();

    topicForm.reset();
}

import { createDomElement } from "./dom.js";
import commentsService from "./services/commentsService.js";
import postsService from "./services/postsService.js";

const params = new URLSearchParams(window.location.search);
const postId = params.get('postId');

const postElement = document.getElementById('post');
const titleElement = document.getElementById('title');

const commentsForm = document.getElementById('comment-form');
commentsForm.addEventListener('submit', onCommentsFormSubmitHandler);

await getPost();

async function getPost() {
    const [postResponse, commentsResponse] = await Promise.all([
        postsService.getById(postId),
        commentsService.getCommentsPerPost(postId)
    ]);

    if(!postResponse.success || !commentsResponse.success) {
        const error = postResponse.success ? commentsResponse.data : postResponse.data;

        alert(error);
        return;
    }

    titleElement.textContent = postResponse.data.title;
    postElement.replaceChildren(createPostHeader(postResponse.data));

    commentsResponse.data.map(createComment).forEach(c => postElement.appendChild(c));
}

function createPostHeader(postData) {
    const postHeader = createDomElement(
        'div', 
        { classList: 'header', },
        createDomElement('img', {src: './static/profile.png', alt: 'avatar'}),
        createDomElement(
            'p', 
            {},
            createDomElement('span', {}, postData.username),
            ' posted on ',
            createDomElement('time', {}, postData.time)
        ),
        createDomElement('p', {classList: 'post-content'}, postData.post)
    );

    return postHeader;
}

function createComment(commentData) {
    const comment = createDomElement(
        'div', 
        {id: 'user-comment'},
        createDomElement(
            'div', 
            {classList: 'topic-name-wrapper'},
            createDomElement(
                'div', 
                {classList: 'topic-name'},
                createDomElement(
                    'p', 
                    {},
                    createDomElement('strong', {}, commentData.username),
                    ' commented on ',
                    createDomElement('time', {}, commentData.time)
                ),
                createDomElement('div', {classList: 'post-content'}, createDomElement('p', {}, commentData.comment))
            )
        )
    );

    return comment;
}

async function onCommentsFormSubmitHandler(event) {
    event.preventDefault();

    const formData = new FormData(commentsForm);

    const comment = formData.get('postText');
    const username = formData.get('username');
    const time = new Date();

    const data = {
        comment,
        username,
        time,
        postId
    };

    const response = await commentsService.create(data);

    if(!response.success) {
        alert(response.data);
        return
    }

    commentsForm.reset();
    await getPost();
}
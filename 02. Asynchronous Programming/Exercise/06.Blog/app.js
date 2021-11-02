const postsElement = document.getElementById('posts');

const postTitleElement = document.getElementById('post-title');
const postBodyElement = document.getElementById('post-body');
const postCommentsElement = document.getElementById('post-comments');

const getAllPosts = async () =>  Object.values(await requester(`http://localhost:3030/jsonstore/blog/posts`));

const getPostByPostId = async (postId) => await requester(`http://localhost:3030/jsonstore/blog/posts/${postId}`);

const getAllCommentsForGivenPost = async (postId) => Object
    .values(await requester(`http://localhost:3030/jsonstore/blog/comments`))
    .filter(c => c.postId === postId);

(function attachEvents() {
    const loadPostsButton = document.getElementById('btnLoadPosts');
    const viewPostButton = document.getElementById('btnViewPost');

    loadPostsButton.addEventListener('click', onLoadPostsButtonClick);
    viewPostButton.addEventListener('click', onViewPostButtonClick);
})(); 

async function onLoadPostsButtonClick() { 
    postsElement.replaceChildren();
    postsElement.appendChild(createDOMElement('option', {}, 'Loading...'));

    var posts = await getAllPosts();
    
    postsElement.replaceChildren();

    posts
        .forEach(element => {
            postsElement.appendChild(createDOMElement('option', {value: element.id}, element.title));
        });
}

async function onViewPostButtonClick() {
    postTitleElement.textContent = 'Loading...';
    postBodyElement.textContent = '';
    postCommentsElement.innerHTML = '';

    const postId = postsElement.value;
    const post = await getPostByPostId(postId);
    const comments = await getAllCommentsForGivenPost(postId);

    renderPost(post, comments);
}

function renderPost(post, comments) {
    postTitleElement.textContent = post.title;
    postBodyElement.textContent = post.body;

    comments.forEach(c => postCommentsElement.appendChild(createDOMElement('li', {id: c.id}, c.text)))
}

async function requester(url) {
    try {
        const res = await fetch(url);

        if(res.status != 200) {
            throw new Error('Not Found');
        }

        const data = await res.json();     
        return data; 

    } catch(err) {
        console.error(err.message);        
    }
}

function createDOMElement(type, attr, ...content) {
    const element = document.createElement(type);       

    Object.assign(element, attr);

    for (let item of content) {
        if(typeof(item) === 'string' 
        || typeof(item) === 'number') {
            item = document.createTextNode(item);
        }

        element.appendChild(item);
    }

    return element;
};
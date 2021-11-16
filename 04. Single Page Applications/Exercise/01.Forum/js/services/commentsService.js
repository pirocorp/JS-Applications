import requesterService from './requester.js';

const endpoint = '/jsonstore/collections/myboard/comments';

const create = async (data) => requesterService.post(endpoint, data);

async function getCommentsPerPost (postId){
    const response = await requesterService.get(`${endpoint}`);

    if(!response.success) {
        return response
    }

    response.data = Object.values(response.data).filter(r => r['postId'] == postId);
    return response;
} 

const commentsService = {
    create,
    getCommentsPerPost
};

export default commentsService;
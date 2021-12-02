import requesterService from '../api/requester.js';
import { simpleErrorHandler } from '../infrastructure/ui.js';

const endpoint = '/data/books';

const getAll = async () => requesterService.get(`${endpoint}?sortBy=_createdOn%20desc`);

const getById = async (id) => requesterService.get(`${endpoint}/${id}`);

const getByOwnerId = async (userId) => requesterService.get(`${endpoint}?where=_ownerId%3D%22${userId}%22&sortBy=_createdOn%20desc`);

const create = async (data) => requesterService.post(endpoint, data);

const edit = async (id, data) => requesterService.put(`${endpoint}/${id}`, data);

const del = async (id) => requesterService.delete(`${endpoint}/${id}`);

const booksService = {
    getAll: () => simpleErrorHandler(getAll),
    getById: (id) => simpleErrorHandler(getById, id),
    getByOwnerId: (userId) => simpleErrorHandler(getByOwnerId, userId) ,
    create: (data) => simpleErrorHandler(create, data),
    edit: (id, data) => simpleErrorHandler(edit, id, data),
    delete: (id) => simpleErrorHandler(del, id)
}

export default booksService;
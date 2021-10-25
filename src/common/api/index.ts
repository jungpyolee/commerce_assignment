import { Category, Token } from '@constants';
import { CurrentUser } from '@interfaces';
import { getToken } from '@store';
import { API, API_URL, VERSION } from './api.config';

export const refresh = (): Promise<{ data: Token }> =>
  API.post(
    '/token',
    {},
    {
      headers: { 'X-CSRF-TOKEN': getToken().csrf, Authorization: `Bearer ${getToken().token}` },
    },
  );

export const get = (url: string, params: any) => API.get(url, params);
export const loginAPI = (params: any) => API.post('/login', { user: params });
export const signupAPI = (params: any) => API.post('/signup', { user: params });
export const logoutAPI = () => API.delete('/logout');
export const userMeApi = () => API.get<CurrentUser>('/users/me');

// export const {
//   query: getItems,
//   get: getItem,
//   create: createItem,
//   update: updateItem,
//   destroy: destroyItem,
// } = ApiService('items');

// export const { query: getUsers, get: getUser } = ApiService('users');
// export const { query: getCategories, get: getCategory } = ApiService('categories');

export const getItems = (params = null) => API.get<any>('/items', { params });
export const getCategories = (params = null) => API.get<Category[]>('/categories', { params });
export const getCategory = (id, params = null) => API.get<Category>(`/categories/${id}`, { params });

export const getPosts = () => async (params = null) => {
  const { data } = await API.get('/posts', { params });
  return data;
};
export const getPost = (postId) => async () => {
  const { data } = await API.get<any>(`/posts/${postId}`);
  return data;
};
export const createPost = (params) => API.post('/posts', { post: params });
export const updatePost = (postId, params) => API.patch(`/posts/${postId}`, { post: params });
export const destroyPost = (postId) => API.delete(`/posts/${postId}`);

export { API_URL, VERSION };

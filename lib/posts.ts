
import * as cache from './cache'
import { PostListResponse, Posts } from '../types/post';

const getPosts = async (): Promise<PostListResponse> => {
    const url = 'https://jsonplaceholder.typicode.com/posts';
    const is_cached = cache.has(url)
    console.table({ action: 'fetching posts', is_cached });
    return { posts: cache.get<Posts>(url), is_cached }
}

export default getPosts

import * as cache from '../lib/cache'
import { PostListResponse, Posts } from '../types/post';

const getPosts = async (): Promise<PostListResponse> => {
    const url = 'https://jsonplaceholder.typicode.com/posts';
    const is_cached = cache.has(url)
    if (is_cached) {
        console.table({ action: 'fetching posts', cached: true });
        return { posts: cache.get<Posts>(url), is_cached }
    }
    console.table({ action: 'fetching posts', cached: false });
    const posts = await fetch(url)
        .then(response => response.json())
    cache.set<Posts>(url, posts)
    return { posts, is_cached };
}

export default getPosts
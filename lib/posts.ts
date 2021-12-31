
import * as cache from '../lib/cache'
import { Posts } from '../types/post';

const getPosts = async (): Promise<Posts> => {
    const url = 'https://jsonplaceholder.typicode.com/posts';
    if (cache.has(url)) {
        console.table({ action: 'fetching posts', cached: true });
        return cache.get<Posts>(url)
    }
    console.table({ action: 'fetching posts', cached: false });
    const posts = await fetch(url)
        .then(response => response.json())
    cache.set<Posts>(url, posts)
    return posts;
}

export default getPosts
import nodeFetch from "node-fetch"
import fetchRetry from "@vercel/fetch-retry"
import * as cache from "lib/cache"

const fetch = fetchRetry(nodeFetch)

const fetchPosts = async (): Promise<void> => {
    const url = 'https://jsonplaceholder.typicode.com/posts';
    const is_cached = cache.has(url)
    console.table({ script: "prebuild", action: 'fetching posts', is_cached });
    if (is_cached && !cache.isExpired(url)) {
        return
    }
    const posts = await fetch(url)
        .then((response: Response) => response.json())
        .catch((error: any) => { console.log(error) })
    cache.set(url, posts)
    cache.updateBuildInfo()
}

export default fetchPosts

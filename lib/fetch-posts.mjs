import * as fs from 'fs';
import * as cache from './cache.mjs'
import fetch from "node-fetch";

const fetchPosts = async () => {
    const url = 'https://jsonplaceholder.typicode.com/posts';
    const is_cached = cache.has(url)
    if (is_cached) {
        console.table({ script: "prebuild", action: "fetching posts", cached: true })
        return
    }
    console.table({ script: "prebuild", action: 'fetching posts', cached: false });
    const posts = await fetch(url)
        .then(response => response.json())
    cache.set(url, posts)
    setAppInfo()
}

const setAppInfo = () => {
    if (!isCachePathWriteable()) return
    const jsonStr = JSON.stringify({ build_created_at: (new Date()).toLocaleString("en-US") })
    fs.writeFileSync(basePath + '/app.json', jsonStr)
}

fetchPosts();
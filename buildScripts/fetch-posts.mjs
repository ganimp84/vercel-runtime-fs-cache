import * as fs from "fs";
import * as cache from "./../lib/cache.mjs"
import fetch from "node-fetch"

const fetchPosts = async () => {
    const url = 'https://jsonplaceholder.typicode.com/posts';
    const is_cached = cache.has(url)
    console.table({ script: "prebuild", action: 'fetching posts', is_cached });
    if (is_cached && !cache.isExpired(url)) {
        return
    }
    const posts = await fetch(url)
        .then(response => response.json())
        .catch(error => { console.log(error) })
    cache.set(url, posts)
    setAppInfo()
}

const setAppInfo = () => {
    if (!cache.isCachePathWriteable()) return
    const jsonStr = JSON.stringify({ build_created_at: (new Date()).toLocaleString("en-US") })
    fs.writeFileSync(cache.getOpts().cachePath + '/app.json', jsonStr)
}

fetchPosts();
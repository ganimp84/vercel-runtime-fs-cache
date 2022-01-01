import crypto from 'crypto'
import * as fs from 'fs';

const fetchPosts = async () => {
    const url = 'https://jsonplaceholder.typicode.com/posts';
    const is_cached = hasCache(url)
    if (is_cached) {
        console.table({ script: "prebuild", action: "fetching posts", cached: true })
        return
    }
    console.table({ script: "prebuild", action: 'fetching posts', cached: false });
    const posts = await fetch(url)
        .then(response => response.json())
    setCache(url, posts)
}

const basePath = process.cwd() + '/cache/'
const ttl = process.env.CACHE_TTL ?? 3600 * 1000

export const getCache = (key) => {
    const buffer = fs.readFileSync(basePath + hash(key), 'utf-8')
    return JSON.parse(buffer).data
}

export const setCache = (key, data) => {
    if (!isCachePathWriteable()) return
    const jsonStr = JSON.stringify({ created_at: Date.now(), data })
    fs.writeFileSync(basePath + hash(key), jsonStr)
    listCachePathContent({ when: "after writing into cache" })
}

export const hasCache = (key) => {
    listCachePathContent({ when: "while checking cache existence" })

    const path = basePath + hash(key)
    return fs.existsSync(path) && !isCacheExpired(path)
}

const isCacheExpired = (path) => {
    const buffer = fs.readFileSync(path, 'utf-8')
    const cacheResponse = JSON.parse(buffer)
    console.table({ now: Date.now(), created_at: cacheResponse.created_at, ttl })
    return Date.now() - cacheResponse.created_at > ttl
}

const hash = (key) => crypto.createHash('md5').update(key).digest('hex')

const isCachePathWriteable = () => {
    let isWriteable;
    try {
        fs.accessSync(basePath, fs.constants.W_OK)
        isWriteable = true
    } catch (error) {
        isWriteable = false
    }
    console.table({ path: basePath, exists: fs.existsSync(basePath), isWriteable })
    return isWriteable
}

const listCachePathContent = ({ when }) => {
    const contents = fs.readdirSync(basePath, { withFileTypes: true })
        // .filter(dirent => dirent.isDirectory())
        .map(content => content.name)
    console.table({ when, what: "cahce path contents", ...contents })
}

fetchPosts();
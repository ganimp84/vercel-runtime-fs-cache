import crypto from 'crypto'
import * as fs from 'fs';

const basePath = process.cwd() + '/cache/'

export const get = (key) => {
    const buffer = fs.readFileSync(basePath + hash(key), 'utf-8')
    return JSON.parse(buffer).data
}

export const set = (key, data) => {
    if (!isCachePathWriteable()) return
    const jsonStr = JSON.stringify({ created_at: Date.now(), data })
    fs.writeFileSync(basePath + hash(key), jsonStr)
    listCachePathContent({ when: "after writing into cache" })
}

export const has = (key) => {
    listCachePathContent({ when: "while checking cache existence" })

    const path = basePath + hash(key)
    return fs.existsSync(path)
}

const isExpired = (path) => {
    const buffer = fs.readFileSync(path, 'utf-8')
    const cacheResponse = JSON.parse(buffer)
    console.table({ now: Date.now(), created_at: cacheResponse.created_at, ttl })
    return Date.now() - cacheResponse.created_at > ttl
}

const hash = (key) => crypto.createHash('md5').update(key).digest('hex')

export const isCachePathWriteable = () => {
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
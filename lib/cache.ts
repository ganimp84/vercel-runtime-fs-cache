import crypto from 'crypto'
import * as fs from 'fs';

const basePath = process.cwd() + '/' + process.env.CACHE_PATH + '/'
const ttl = process.env.CACHE_TTL ?? 3600 * 1000

type FilePath = string

type CacheResponse = {
    created_at: number,
    data: string
}

export const get = <Type>(key: string): Type => {
    const buffer = fs.readFileSync(basePath + hash(key), 'utf-8')
    return JSON.parse(buffer).data
}

export const set = <Type>(key: string, data: Type) => {
    if (!isCachePathWriteable()) return
    const jsonStr = JSON.stringify({ created_at: Date.now(), data })
    fs.writeFileSync(basePath + hash(key), jsonStr)
    listCachePathContent({ when: "after writing into cache" })
}

export const has = (key: string): boolean => {
    listCachePathContent({ when: "while checking cache existence" })

    const path: FilePath = basePath + hash(key)
    return fs.existsSync(path) && !isExpired(path)
}

const isExpired = (path: FilePath): boolean => {
    const buffer = fs.readFileSync(path, 'utf-8')
    const cacheResponse: CacheResponse = JSON.parse(buffer)
    console.table({ now: Date.now(), created_at: cacheResponse.created_at, ttl })
    return Date.now() - cacheResponse.created_at > ttl
}

const hash = (key: string) => crypto.createHash('md5').update(key).digest('hex')

const isCachePathWriteable = (): boolean => {
    let isWriteable: boolean;
    try {
        fs.accessSync(basePath, fs.constants.W_OK)
        isWriteable = true
    } catch (error) {
        isWriteable = false
    }
    console.table({ path: basePath, exists: fs.existsSync(basePath), isWriteable })
    return isWriteable
}

const listCachePathContent = ({ when }: { when: string }) => {
    const contents = fs.readdirSync(basePath, { withFileTypes: true })
        // .filter(dirent => dirent.isDirectory())
        .map(content => content.name)
    console.table({ when, what: "cahce path contents", ...contents })
}
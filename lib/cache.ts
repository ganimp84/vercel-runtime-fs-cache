import crypto from 'crypto'
import * as fs from "fs";
import { CacheBuildInfo, CacheResponse } from "types/cache";

const CACHE_PATH = process.cwd() + '/.next/cache/'
const CACHE_INFO_FILE = CACHE_PATH + 'info.json'
const CACHE_TTL = 3600000

export const get = <Type>(key: string): Type => {
    const buffer = fs.readFileSync(CACHE_PATH + hash(key), 'utf-8')
    return JSON.parse(buffer).data
}

export const set = <Type>(key: string, data: Type) => {
    if (!isCachePathWriteable()) return
    const jsonStr = JSON.stringify({ created_at: Date.now(), data })
    fs.writeFileSync(CACHE_PATH + hash(key), jsonStr)
    listCachePathContent({ when: "after writing into cache" })
}

export const has = (key: string) => {
    listCachePathContent({ when: "while checking cache existence" })
    return fs.existsSync(CACHE_PATH + hash(key))
}

export const isExpired = (key: string): boolean => {
    const buffer = fs.readFileSync(CACHE_PATH + hash(key), 'utf-8')
    const cacheResponse: CacheResponse = JSON.parse(buffer)
    console.table({ now: Date.now(), created_at: cacheResponse.created_at, ttl: CACHE_TTL })
    return Date.now() - cacheResponse.created_at > CACHE_TTL
}

const hash = (key: string) => crypto.createHash('md5').update(key).digest('hex')

export const isCachePathWriteable = (): boolean => {
    let isWriteable;
    try {
        fs.accessSync(CACHE_PATH, fs.constants.W_OK)
        isWriteable = true
    } catch (error) {
        isWriteable = false
    }
    console.table({ path: CACHE_PATH, exists: fs.existsSync(CACHE_PATH), isWriteable })
    return isWriteable
}

const listCachePathContent = ({ when }: { when: string }) => {
    const contents = fs.readdirSync(CACHE_PATH, { withFileTypes: true })
        // .filter(dirent => dirent.isDirectory())
        .map(content => content.name)
    console.table({ when, what: "cahce path contents", ...contents })
}

export const updateBuildInfo = (): void => {
    if (!isCachePathWriteable()) return
    const jsonStr = JSON.stringify({ cache_updated_at: (new Date()).toLocaleString("en-US") })
    fs.writeFileSync(CACHE_INFO_FILE, jsonStr)
}

export const getBuildInfo = (): CacheBuildInfo => {
    const buffer = fs.readFileSync(CACHE_INFO_FILE, 'utf-8')
    const cacheBuildInfo: CacheBuildInfo = JSON.parse(buffer)
    return cacheBuildInfo
}

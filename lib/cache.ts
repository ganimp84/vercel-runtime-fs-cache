import crypto from 'crypto'
import * as fs from "fs";
import { CacheConfig, CacheResponse } from "../types/cache";

const opts: CacheConfig = {
    cachePath: process.cwd() + '/cache/',
    ttl: 3600000
}

export const getOpts = (): CacheConfig => {
    return opts;
}

export const get = <Type>(key: string): Type => {
    const buffer = fs.readFileSync(opts.cachePath + hash(key), 'utf-8')
    return JSON.parse(buffer).data
}

export const set = <Type>(key: string, data: Type) => {
    if (!isCachePathWriteable()) return
    const jsonStr = JSON.stringify({ created_at: Date.now(), data })
    fs.writeFileSync(opts.cachePath + hash(key), jsonStr)
    listCachePathContent({ when: "after writing into cache" })
}

export const has = (key: string) => {
    listCachePathContent({ when: "while checking cache existence" })
    return fs.existsSync(opts.cachePath + hash(key))
}

export const isExpired = (key: string): boolean => {
    const buffer = fs.readFileSync(opts.cachePath + hash(key), 'utf-8')
    const cacheResponse: CacheResponse = JSON.parse(buffer)
    console.table({ now: Date.now(), created_at: cacheResponse.created_at, ttl: opts.ttl })
    return Date.now() - cacheResponse.created_at > opts.ttl
}

const hash = (key: string) => crypto.createHash('md5').update(key).digest('hex')

export const isCachePathWriteable = (): boolean => {
    let isWriteable;
    try {
        fs.accessSync(opts.cachePath, fs.constants.W_OK)
        isWriteable = true
    } catch (error) {
        isWriteable = false
    }
    console.table({ path: opts.cachePath, exists: fs.existsSync(opts.cachePath), isWriteable })
    return isWriteable
}

const listCachePathContent = ({ when }: { when: string }) => {
    const contents = fs.readdirSync(opts.cachePath, { withFileTypes: true })
        // .filter(dirent => dirent.isDirectory())
        .map(content => content.name)
    console.table({ when, what: "cahce path contents", ...contents })
}
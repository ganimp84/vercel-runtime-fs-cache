import crypto from 'crypto'
import * as fs from "fs";

const opts = {
    cachePath: process.cwd() + '/cache/',
    ttl: 3600000
}

export const getOpts = () => {
    return opts;
}

export const get = (key) => {
    const buffer = fs.readFileSync(opts.cachePath + hash(key), 'utf-8')
    return JSON.parse(buffer).data
}

export const set = (key, data) => {
    if (!isCachePathWriteable()) return
    const jsonStr = JSON.stringify({ created_at: Date.now(), data })
    fs.writeFileSync(opts.cachePath + hash(key), jsonStr)
    listCachePathContent({ when: "after writing into cache" })
}

export const has = (key) => {
    listCachePathContent({ when: "while checking cache existence" })
    return fs.existsSync(opts.cachePath + hash(key))
}

export const isExpired = (key) => {
    const buffer = fs.readFileSync(opts.cachePath + hash(key), 'utf-8')
    const cacheResponse = JSON.parse(buffer)
    console.table({ now: Date.now(), created_at: cacheResponse.created_at, ttl: opts.ttl })
    return Date.now() - cacheResponse.created_at > opts.ttl
}

const hash = (key) => crypto.createHash('md5').update(key).digest('hex')

export const isCachePathWriteable = () => {
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

const listCachePathContent = ({ when }) => {
    const contents = fs.readdirSync(opts.cachePath, { withFileTypes: true })
        // .filter(dirent => dirent.isDirectory())
        .map(content => content.name)
    console.table({ when, what: "cahce path contents", ...contents })
}
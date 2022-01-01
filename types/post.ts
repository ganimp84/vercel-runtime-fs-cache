export type Post = {
    userId: number,
    id: number,
    title: string,
    body: string
}

export type Posts = Array<Post>

export type PostListResponse = {
    posts: Posts,
    is_cached: boolean
}
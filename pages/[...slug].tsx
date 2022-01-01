import * as React from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { PostListResponse, Posts } from '../types/post';
import getPosts from '../lib/posts';
import Blog from '../components/blog';
import { ParsedUrlQuery } from 'querystring';

interface BlogProps {
    postListResponse: PostListResponse
}

const Page: NextPage<BlogProps> = (props) => {
    return <Blog postListResponse={props.postListResponse}></Blog>
}

interface Params extends ParsedUrlQuery {
    slug: string
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { slug } = context.params as Params
    console.table({ action: 'Generating/ Regenerating ' + slug });
    const postListResponse = await getPosts()
    return {
        props: { postListResponse, revalidate: 1 * 60 * 60 }, // will be passed to the page component as props
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    // ISR pages
    const numberOfISRPages = 12
    let paths = []
    for (let i = 0; i < numberOfISRPages; i++) {
        paths.push({ params: { slug: ['page-' + i] } })
    }
    return { paths, fallback: 'blocking' }
}

export default Page
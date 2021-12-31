import * as React from 'react';
import { GetStaticProps, NextPage } from 'next';
import { Posts } from '../types/post';
import getPosts from '../lib/posts';
import Blog from '../components/blog';

interface BlogProps {
    posts: Posts
}

const Page_7: NextPage<BlogProps> = (props) => {
    return <Blog posts={props.posts}></Blog>
}

export const getStaticProps: GetStaticProps = async (context) => {
    console.table({ action: 'Generating/ Regenerating /blog page' });
    const posts = await getPosts()
    return {
        props: { posts, revalidate: 24 * 60 * 60 }, // will be passed to the page component as props
    }
}

export default Page_7
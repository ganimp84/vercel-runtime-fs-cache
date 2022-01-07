import fetchPosts from "./lib/fetch";

const Prebuild = async () => {
    await fetchPosts()
}

Prebuild();
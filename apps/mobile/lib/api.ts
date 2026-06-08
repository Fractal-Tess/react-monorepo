export type Post = {
	id: number;
	userId: number;
	title: string;
	body: string;
};

export async function fetchPosts(): Promise<Post[]> {
	const response = await fetch(
		"https://jsonplaceholder.typicode.com/posts?_limit=15",
	);
	if (!response.ok) {
		throw new Error(`Failed to fetch posts: ${response.status}`);
	}
	return (await response.json()) as Post[];
}

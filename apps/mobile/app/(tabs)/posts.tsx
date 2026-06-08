import { useQuery } from "@tanstack/react-query";
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	RefreshControl,
	Text,
	View,
} from "react-native";

import { Screen } from "../../components/screen";
import { fetchPosts, type Post } from "../../lib/api";

export default function PostsScreen() {
	const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
		queryKey: ["posts"],
		queryFn: fetchPosts,
	});

	return (
		<Screen subtitle="Fetched with React Query" title="Posts">
			{isLoading ? (
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator color="#00d4ff" size="large" />
				</View>
			) : null}

			{isError ? (
				<View className="flex-1 items-center justify-center gap-3">
					<Text className="text-center text-base text-text">
						{error instanceof Error ? error.message : "Something went wrong"}
					</Text>
					<Pressable
						className="rounded-xl bg-accent px-4 py-2 active:opacity-80"
						onPress={() => refetch()}
					>
						<Text className="font-semibold text-black">Try again</Text>
					</Pressable>
				</View>
			) : null}

			{data ? (
				<FlatList
					contentContainerClassName="gap-3 pb-4"
					data={data}
					keyExtractor={(item) => String(item.id)}
					refreshControl={
						<RefreshControl
							onRefresh={refetch}
							refreshing={isRefetching}
							tintColor="#00d4ff"
						/>
					}
					renderItem={({ item }) => <PostRow post={item} />}
				/>
			) : null}
		</Screen>
	);
}

function PostRow({ post }: { post: Post }) {
	return (
		<View className="rounded-xl border border-white/10 bg-card p-4">
			<Text className="font-semibold text-base text-text capitalize">
				{post.title}
			</Text>
			<Text className="mt-2 text-sm text-muted" numberOfLines={3}>
				{post.body}
			</Text>
		</View>
	);
}

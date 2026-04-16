import { Pressable, Text, View } from "react-native";

import { useCounterStore } from "../lib/use-counter-store";

export default function HomeScreen() {
	const count = useCounterStore((state) => state.count);
	const increment = useCounterStore((state) => state.increment);
	const decrement = useCounterStore((state) => state.decrement);

	return (
		<View className="flex-1 items-center justify-center bg-background px-6">
			<View className="w-full max-w-sm rounded-xl border border-white/10 bg-card p-6">
				<Text className="text-center font-semibold text-3xl text-text tracking-tight">
					Mobile Starter
				</Text>
				<Text className="mt-2 text-center text-base text-muted">
					Expo Router + NativeWind + Zustand + React Query
				</Text>

				<Text className="mt-10 text-center font-bold text-6xl text-accent">
					{count}
				</Text>

				<View className="mt-8 flex-row gap-3">
					<Pressable
						className="flex-1 rounded-xl border border-white/10 bg-black/25 px-4 py-3 active:opacity-70"
						onPress={decrement}
					>
						<Text className="text-center font-semibold text-base text-text">
							-1
						</Text>
					</Pressable>
					<Pressable
						className="flex-1 rounded-xl bg-accent px-4 py-3 active:opacity-80"
						onPress={increment}
					>
						<Text className="text-center font-semibold text-base text-black">
							+1
						</Text>
					</Pressable>
				</View>
			</View>
		</View>
	);
}

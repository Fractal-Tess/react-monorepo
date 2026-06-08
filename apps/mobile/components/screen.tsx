import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenProps = {
	title: string;
	subtitle?: string;
	children: ReactNode;
};

export function Screen({ title, subtitle, children }: ScreenProps) {
	return (
		<SafeAreaView className="flex-1 bg-background" edges={["top"]}>
			<View className="px-6 pt-4 pb-2">
				<Text className="font-bold text-2xl text-text tracking-tight">
					{title}
				</Text>
				{subtitle ? (
					<Text className="mt-1 text-base text-muted">{subtitle}</Text>
				) : null}
			</View>
			<View className="flex-1 px-6 pb-6">{children}</View>
		</SafeAreaView>
	);
}

import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: "#00d4ff",
				tabBarInactiveTintColor: "#94a3b8",
				tabBarStyle: {
					backgroundColor: "#121a33",
					borderTopColor: "rgba(255,255,255,0.08)",
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Counter",
					tabBarIcon: ({ color, size }) => (
						<Ionicons color={color} name="calculator-outline" size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="todos"
				options={{
					title: "Todos",
					tabBarIcon: ({ color, size }) => (
						<Ionicons color={color} name="checkmark-done-outline" size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="posts"
				options={{
					title: "Posts",
					tabBarIcon: ({ color, size }) => (
						<Ionicons color={color} name="newspaper-outline" size={size} />
					),
				}}
			/>
		</Tabs>
	);
}

import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";

import { Screen } from "../../components/screen";
import { type Todo, useTodosStore } from "../../lib/use-todos-store";

export default function TodosScreen() {
	const todos = useTodosStore((state) => state.todos);
	const addTodo = useTodosStore((state) => state.addTodo);
	const toggleTodo = useTodosStore((state) => state.toggleTodo);
	const removeTodo = useTodosStore((state) => state.removeTodo);
	const clearCompleted = useTodosStore((state) => state.clearCompleted);

	const [draft, setDraft] = useState("");

	const remaining = useMemo(
		() => todos.filter((todo) => !todo.done).length,
		[todos],
	);

	const handleAdd = () => {
		addTodo(draft);
		setDraft("");
	};

	return (
		<Screen
			subtitle={`${remaining} of ${todos.length} remaining`}
			title="Todos"
		>
			<View className="mt-2 flex-row gap-2">
				<TextInput
					className="flex-1 rounded-xl border border-white/10 bg-card px-4 py-3 text-text"
					onChangeText={setDraft}
					onSubmitEditing={handleAdd}
					placeholder="Add a new todo"
					placeholderTextColor="#64748b"
					returnKeyType="done"
					value={draft}
				/>
				<Pressable
					accessibilityLabel="Add todo"
					className="items-center justify-center rounded-xl bg-accent px-4 active:opacity-80"
					onPress={handleAdd}
				>
					<Ionicons color="#000" name="add" size={22} />
				</Pressable>
			</View>

			<FlatList
				className="mt-4"
				contentContainerClassName="gap-2 pb-4"
				data={todos}
				ItemSeparatorComponent={null}
				keyExtractor={(item) => item.id}
				ListEmptyComponent={
					<Text className="mt-10 text-center text-muted">
						No todos yet — add one above.
					</Text>
				}
				renderItem={({ item }) => (
					<TodoRow
						onRemove={() => removeTodo(item.id)}
						onToggle={() => toggleTodo(item.id)}
						todo={item}
					/>
				)}
			/>

			{todos.some((todo) => todo.done) ? (
				<Pressable
					className="mt-2 self-start rounded-xl border border-white/10 px-4 py-2 active:opacity-70"
					onPress={clearCompleted}
				>
					<Text className="text-sm text-muted">Clear completed</Text>
				</Pressable>
			) : null}
		</Screen>
	);
}

type TodoRowProps = {
	todo: Todo;
	onToggle: () => void;
	onRemove: () => void;
};

function TodoRow({ todo, onToggle, onRemove }: TodoRowProps) {
	return (
		<View className="flex-row items-center gap-3 rounded-xl border border-white/10 bg-card px-4 py-3">
			<Pressable
				accessibilityLabel={todo.done ? "Mark incomplete" : "Mark complete"}
				accessibilityRole="checkbox"
				accessibilityState={{ checked: todo.done }}
				className="h-6 w-6 items-center justify-center rounded-full border border-accent"
				onPress={onToggle}
			>
				{todo.done ? (
					<Ionicons color="#00d4ff" name="checkmark" size={16} />
				) : null}
			</Pressable>
			<Text
				className={`flex-1 text-base ${
					todo.done ? "text-muted line-through" : "text-text"
				}`}
			>
				{todo.text}
			</Text>
			<Pressable
				accessibilityLabel="Remove todo"
				className="p-1 active:opacity-60"
				onPress={onRemove}
			>
				<Ionicons color="#94a3b8" name="trash-outline" size={18} />
			</Pressable>
		</View>
	);
}

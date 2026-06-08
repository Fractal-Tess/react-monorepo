import { create } from "zustand";

export type Todo = {
	id: string;
	text: string;
	done: boolean;
};

type TodosState = {
	todos: Todo[];
	addTodo: (text: string) => void;
	toggleTodo: (id: string) => void;
	removeTodo: (id: string) => void;
	clearCompleted: () => void;
};

export const useTodosStore = create<TodosState>((set) => ({
	todos: [
		{ id: "seed-1", text: "Try the counter tab", done: true },
		{ id: "seed-2", text: "Add your own todo", done: false },
		{ id: "seed-3", text: "Refresh the posts feed", done: false },
	],
	addTodo: (text) =>
		set((state) => {
			const trimmed = text.trim();
			if (trimmed.length === 0) {
				return state;
			}
			const todo: Todo = {
				id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
				text: trimmed,
				done: false,
			};
			return { todos: [todo, ...state.todos] };
		}),
	toggleTodo: (id) =>
		set((state) => ({
			todos: state.todos.map((todo) =>
				todo.id === id ? { ...todo, done: !todo.done } : todo,
			),
		})),
	removeTodo: (id) =>
		set((state) => ({
			todos: state.todos.filter((todo) => todo.id !== id),
		})),
	clearCompleted: () =>
		set((state) => ({ todos: state.todos.filter((todo) => !todo.done) })),
}));

import type { Config } from "tailwindcss";

const config: Config = {
	content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
	theme: {
		extend: {
			colors: {
				background: "#0b1020",
				card: "#121a33",
				accent: "#00d4ff",
				text: "#e6f1ff",
				muted: "#94a3b8",
			},
			borderRadius: {
				xl: "1rem",
			},
		},
	},
	presets: [require("nativewind/preset")],
};

export default config;

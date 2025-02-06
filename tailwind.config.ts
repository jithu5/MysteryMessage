import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx}", // ✅ Include Next.js App Router
	],
	theme: {
		extend: {
			colors: {
				background: "#121212", // Soft black
				foreground: "#6785FF", // electric blue for text
				lightBackground: "#333333",
				border: "#333333", // Dark border for soft contrast
				input: "#1E1E1E", // Dark input fields
				ring: "#F50057", // Bright pink for focus elements
			},
		},
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;

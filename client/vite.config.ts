import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

const clientSrc = fileURLToPath(new URL("./src", import.meta.url));
const srcPath = (path: string) =>
	fileURLToPath(new URL(`./src/${path}`, import.meta.url));

const serverProxyTarget = "http://localhost:3000";

export default defineConfig({
	plugins: [
		// Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
		}),
		react(),
		tailwindcss(),
	],
	server: {
		host: "0.0.0.0",
		proxy: {
			"/api": {
				target: serverProxyTarget,
				changeOrigin: true,
			},
			"/hello": {
				target: serverProxyTarget,
				changeOrigin: true,
			},
		},
	},
	resolve: {
		alias: {
			"@assets": srcPath("assets"),
			"@components": srcPath("components"),
			"@features": srcPath("features"),
			"@hooks": srcPath("hooks"),
			"@lib": srcPath("lib"),
			"@routes": srcPath("routes"),
			"@stores": srcPath("stores"),
			"@styles": srcPath("styles"),
			"@three": srcPath("three"),
			"@utils": srcPath("utils"),
			"@": clientSrc,
		},
	},
});

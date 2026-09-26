import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

const clientSrc = fileURLToPath(new URL("./src", import.meta.url));
const workspaceRoot = fileURLToPath(new URL("../", import.meta.url));
const srcPath = (path: string) =>
	fileURLToPath(new URL(`./src/${path}`, import.meta.url));

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, workspaceRoot, "API_PROXY_TARGET");
	const apiProxyTarget =
		env.API_PROXY_TARGET?.trim() || "http://localhost:3000";

	return {
		envDir: workspaceRoot,
		plugins: [
			// Keep the TanStack Router plugin before the React plugin.
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
					target: apiProxyTarget,
					changeOrigin: true,
				},
				"/hello": {
					target: apiProxyTarget,
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
	};
});

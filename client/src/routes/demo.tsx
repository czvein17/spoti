import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { apiClient } from "@lib/api-client";

export const Route = createFileRoute("/demo")({ component: StarterDemo });

function StarterDemo() {
	const [message, setMessage] = useState<string | null>(null);
	const request = useMutation({
		mutationFn: async () => {
			const response = await apiClient.hello.$get();
			if (!response.ok) throw new Error("The starter endpoint is unavailable.");
			return response.json();
		},
		onSuccess: (data) => setMessage(data.message),
		onError: (error) => setMessage(error.message),
	});

	return (
		<main className="demo-page">
			<Link to="/" className="demo-back-link">
				← Back to Afterhours
			</Link>
			<div className="demo-content">
				<p className="eyebrow">Developer demo</p>
				<h1>BHVR starter</h1>
				<p>This page keeps the original typed Hono example available.</p>
				<button
					className="primary-button"
					type="button"
					onClick={() => request.mutate()}
				>
					{request.isPending ? "Checking…" : "Call the Hono endpoint"}
				</button>
				{message ? <pre className="demo-result">{message}</pre> : null}
			</div>
		</main>
	);
}

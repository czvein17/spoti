export async function startServer(
	checkDatabaseConnection: () => Promise<void>,
	startListening: () => void,
): Promise<void> {
	await checkDatabaseConnection();
	startListening();
}

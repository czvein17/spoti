const SESSION_STORAGE_KEY = "afterhours.guest-session.v1";

export type GuestSession = {
	id: string;
	guestName: string;
};

export function readGuestSession(): GuestSession | null {
	try {
		const value = sessionStorage.getItem(SESSION_STORAGE_KEY);
		if (!value) return null;
		const parsed = JSON.parse(value) as Partial<GuestSession>;
		if (typeof parsed.id !== "string" || typeof parsed.guestName !== "string") {
			return null;
		}
		return { id: parsed.id, guestName: parsed.guestName };
	} catch {
		return null;
	}
}

export function createGuestSession(guestName: string): GuestSession {
	const existing = readGuestSession();
	const session = {
		id: existing?.id ?? crypto.randomUUID(),
		guestName: guestName.trim(),
	};
	sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
	return session;
}

export function clearGuestSession() {
	try {
		sessionStorage.removeItem(SESSION_STORAGE_KEY);
	} catch {
		// A closed tab will expire on the server even when storage is unavailable.
	}
}

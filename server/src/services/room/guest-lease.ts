const GUEST_LEASE_MS = 60_000;

export function guestActiveSince(now: Date): Date {
	return new Date(now.getTime() - GUEST_LEASE_MS);
}

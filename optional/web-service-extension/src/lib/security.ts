const SAFE_PROTOCOLS = new Set(["https:"]);

export function safeExternalUrl(
  value: string,
  allowedHosts: readonly string[],
): string | null {
  try {
    const url = new URL(value);
    if (!SAFE_PROTOCOLS.has(url.protocol)) return null;
    if (url.username || url.password) return null;
    if (!allowedHosts.includes(url.hostname.toLowerCase())) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function mutationHeaders(
  csrfToken: string,
): Readonly<Record<string, string>> {
  if (csrfToken.length < 32) throw new Error("유효한 CSRF token이 필요합니다.");
  return {
    "Content-Type": "application/json",
    "X-CSRF-Token": csrfToken,
    "X-Requested-With": "handbook-week3",
  };
}
